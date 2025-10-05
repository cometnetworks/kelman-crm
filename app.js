document.addEventListener('DOMContentLoaded', function() {
    let allContacts = [];

    const contactsGrid = document.getElementById('contactsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterSelector = document.getElementById('filter-selector');
    const noResults = document.getElementById('noResults');
    const contactModal = document.getElementById('contactModal');
    const modalContent = document.getElementById('modalContent');
    const leadCountEl = document.getElementById('leadCount');
    const exportBtn = document.getElementById('exportBtn');
    const paginationContainer = document.getElementById('pagination');

    let currentFilter = 'Todos';
    let currentSearch = '';
    let currentPage = 1;
    const rowsPerPage = 9;

    function getFilteredContacts() {
         return allContacts.filter(c => {
            const searchMatch = currentSearch === '' || 
                (c.nombre && c.nombre.toLowerCase().includes(currentSearch)) ||
                (c.empresa && c.empresa.toLowerCase().includes(currentSearch)) ||
                (c.cargo && c.cargo.toLowerCase().includes(currentSearch)) ||
                (c.email && c.email.toLowerCase().includes(currentSearch));
            
            let filterMatch = true;
            if (currentFilter !== 'Todos') {
                filterMatch = (c.cargo && c.cargo.toLowerCase().includes(currentFilter.toLowerCase()));
            }
            
            return searchMatch && filterMatch;
        });
    }

    function displayPage(page, contacts) {
        contactsGrid.innerHTML = '';
        currentPage = page;
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedContacts = contacts.slice(start, end);

        paginatedContacts.forEach(contact => {
            const card = document.createElement('div');
            card.className = 'card bg-white p-5 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300';
            card.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="font-bold text-lg text-gray-800">${contact.nombre || ''}</h3>
                                <p class="text-sm text-gray-500">${contact.empresa || ''}</p>
                            </div>
                            <span class="tag text-xs font-semibold px-2 py-1 rounded-full">${contact.cargo || ''}</span>
                        </div>
                        <div class="mt-4 space-y-2 text-sm text-gray-600">
                            <p class="flex items-center truncate"><svg class="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg><span class="truncate">${contact.email || ''}</span></p>
                            <p class="flex items-center"><svg class="w-4 h-4 mr-2 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>${contact.celular || ''}</p>
                            <p class="flex items-center"><svg class="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg><a href="${contact.linkedin || '#'}" target="_blank" class="text-blue-600 hover:underline">LinkedIn</a></p>
                        </div>
                        <button data-id="${contact.id}" class="view-details-btn mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 text-sm">
                           <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                           <span>Ver Detalles</span>
                        </button>
                    `;
            contactsGrid.appendChild(card);
        });
    }

    function openModal(contactId) {
         const contact = allContacts.find(c => c.id === contactId);
        if (!contact) return;

        modalContent.innerHTML = `
                    <div class="modal-header text-white p-5 rounded-t-lg flex justify-between items-center">
                        <div class="flex items-center space-x-3">
                             <img src="https://res.cloudinary.com/dtlpkbbcp/image/upload/v1759366535/kelman_oj3fyc.png" alt="Kelman Logo" class="h-8">
                            <div>
                                <h3 class="text-xl font-bold">${contact.nombre || ''}</h3>
                                <p class="text-sm opacity-80">${contact.cargo || ''} en ${contact.empresa || ''}</p>
                            </div>
                        </div>
                        <button id="closeModalBtn" class="text-white hover:text-gray-200 text-2xl leading-none">&times;</button>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-3 uppercase tracking-wider text-base">Información de Contacto</h4>
                                <div class="space-y-4">
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                                        <div>
                                            <p class="text-xs text-gray-500">Email</p>
                                            <a href="mailto:${contact.email || ''}" class="text-blue-600 hover:underline break-all">${contact.email || ''}</a>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                                        <div>
                                            <p class="text-xs text-gray-500">Teléfono</p>
                                            <a href="tel:${contact.celular || ''}" class="text-blue-600 hover:underline">${contact.celular || ''}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-800 mb-3 uppercase tracking-wider text-base">Información Profesional</h4>
                                <div class="space-y-4">
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 6h.008v.008H5.25V6zm0 5.25h.008v.008H5.25v-5.25zm0 5.25h.008v.008H5.25v-5.25z" /></svg>
                                        <div>
                                            <p class="text-xs text-gray-500">Empresa</p>
                                            <p class="text-gray-800 font-semibold">${contact.empresa || ''}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-orange-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                        <div>
                                            <p class="text-xs text-gray-500">Cargo</p>
                                            <span class="tag text-xs font-semibold px-2 py-1 rounded-full">${contact.cargo || ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-6 pt-4 border-t border-gray-200">
                            <h4 class="font-semibold text-gray-800 mb-2 uppercase tracking-wider text-base">Redes Sociales</h4>
                            <a href="${contact.linkedin || '#'}" target="_blank" class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition duration-300">
                                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                Ver Perfil de LinkedIn
                            </a>
                        </div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-b-lg flex justify-end space-x-3">
                        <button id="closeModalFooterBtn" class="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm">Cerrar</button>
                        <a href="mailto:${contact.email || ''}" class="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                            Enviar Email
                        </a>
                    </div>
                `;

        contactModal.classList.remove('hidden');
        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
        }, 10);
        
        document.getElementById('closeModalBtn').addEventListener('click', closeModal);
        document.getElementById('closeModalFooterBtn').addEventListener('click', closeModal);
    }

    function closeModal() {
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            contactModal.classList.add('hidden');
            modalContent.innerHTML = '';
        }, 300);
    }
    
    function createPageButton(page, text, isActive = false, isDisabled = false, isEllipsis = false) {
         const element = isEllipsis ? document.createElement('span') : document.createElement('button');
        element.innerHTML = text || page;
        
        if (isEllipsis) {
            element.className = 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300';
        } else {
            element.dataset.page = page;
            element.disabled = isDisabled;
            element.className = `relative inline-flex items-center px-4 py-2 text-sm font-semibold ${ 
                isActive
                    ? 'bg-orange-500 text-white z-10'
                    : 'text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-100'
            } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`;
            if (!isActive && !isDisabled) {
                element.addEventListener('click', () => {
                    const filtered = getFilteredContacts();
                    displayPage(page, filtered);
                    setupPagination(filtered);
                });
            }
        }
        return element;
    }

    function setupPagination(contacts) {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(contacts.length / rowsPerPage);

        const paginationInfo = document.createElement('div');
        paginationInfo.className = 'text-sm text-gray-500';
        const startItem = contacts.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
        const endItem = Math.min(currentPage * rowsPerPage, contacts.length);
        paginationInfo.innerHTML = `Mostrando <span class="font-semibold text-gray-800">${startItem}</span> a <span class="font-semibold text-gray-800">${endItem}</span> de <span class="font-semibold text-gray-800">${contacts.length}</span> resultados`;
        
        if (pageCount <= 1) {
            if (contacts.length > 0) {
               paginationContainer.appendChild(paginationInfo);
            }
            return;
        }

        const buttonsContainer = document.createElement('nav');
        buttonsContainer.className = 'isolate inline-flex -space-x-px rounded-md shadow-sm';
        
        const prevButton = createPageButton(currentPage - 1, '‹', false, currentPage === 1);
        prevButton.classList.add('rounded-l-md');
        buttonsContainer.appendChild(prevButton);

        const maxVisibleButtons = 5;
        let startPage, endPage;

        if (pageCount <= maxVisibleButtons) {
            startPage = 1;
            endPage = pageCount;
        } else {
            let maxPagesBeforeCurrent = Math.floor(maxVisibleButtons / 2);
            let maxPagesAfterCurrent = Math.ceil(maxVisibleButtons / 2) - 1;
            if (currentPage <= maxPagesBeforeCurrent) {
                startPage = 1;
                endPage = maxVisibleButtons -1;
            } else if (currentPage + maxPagesAfterCurrent >= pageCount) {
                startPage = pageCount - maxVisibleButtons + 2;
                endPage = pageCount;
            } else {
                startPage = currentPage - maxPagesBeforeCurrent + 1;
                endPage = currentPage + maxPagesAfterCurrent -1;
            }
        }

        if (startPage > 1) {
            buttonsContainer.appendChild(createPageButton(1, '1'));
            if (startPage > 2) {
               buttonsContainer.appendChild(createPageButton(0, '...', false, true, true));
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            buttonsContainer.appendChild(createPageButton(i, i, i === currentPage));
        }

        if (endPage < pageCount) {
             if (endPage < pageCount - 1) {
               buttonsContainer.appendChild(createPageButton(0, '...', false, true, true));
            }
            buttonsContainer.appendChild(createPageButton(pageCount, pageCount));
        }

        const nextButton = createPageButton(currentPage + 1, '›', false, currentPage === pageCount);
        nextButton.classList.add('rounded-r-md');
        buttonsContainer.appendChild(nextButton);
        
        paginationContainer.appendChild(paginationInfo);
        paginationContainer.appendChild(buttonsContainer);
    }
    
    function renderAll() {
        const filtered = getFilteredContacts();
        displayPage(currentPage, filtered); // Use currentPage
        setupPagination(filtered);
    }
    
    function createFilterSelector(){
        const cargos = [...new Set(allContacts.map(c => c.cargo).filter(Boolean))];
        let topCargos = ['Todos', 'CEO', 'Director', 'CFO', 'CIO', 'Founder', 'VP', 'Head'];
        let displayCargos = new Set(['Todos']);

        cargos.forEach(cargo => {
            topCargos.forEach(top => {
                if (top !== 'Todos' && cargo.toLowerCase().includes(top.toLowerCase())) {
                    displayCargos.add(top);
                }
            });
        });
        
        filterSelector.innerHTML = '';
        [...displayCargos].sort((a,b) => a === 'Todos' ? -1 : b === 'Todos' ? 1 : a.localeCompare(b)).forEach(cargo => {
            const option = document.createElement('option');
            option.value = cargo;
            option.textContent = cargo;
            filterSelector.appendChild(option);
        });
    }

    // EVENT LISTENERS
    searchInput.addEventListener('input', e => {
        currentSearch = e.target.value.toLowerCase();
        renderAll();
    });

    filterSelector.addEventListener('change', e => {
        currentFilter = e.target.value;
        renderAll();
    });

    contactsGrid.addEventListener('click', e => {
        const btn = e.target.closest('.view-details-btn');
        if (btn) {
            const contactId = parseInt(btn.dataset.id, 10);
            openModal(contactId);
        }
    });
    
    contactModal.addEventListener('click', e => {
        if (e.target === contactModal) {
            closeModal();
        }
    });
    
    exportBtn.addEventListener('click', () => {
        const filtered = getFilteredContacts();
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Nombre,Empresa,Cargo,Email,Celular,LinkedIn\r\n";
        filtered.forEach(row => {
            let rowArray = [row.nombre, row.empresa, row.cargo, row.email, row.celular, row.linkedin];
            csvContent += rowArray.map(item => `"${(item || '').replace(/"/g, '""')}"`).join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "prospectos_kelman_desarrollos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // INITIAL RENDER
    function loadContacts() {
        contactsGrid.innerHTML = '<p class="text-center text-gray-500 col-span-full">Cargando prospectos...</p>';
        fetch('kelman_leads_1000.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                allContacts = data;
                leadCountEl.textContent = allContacts.length;
                createFilterSelector();
                renderAll();
            })
            .catch(error => {
                console.error('Error fetching contacts:', error);
                contactsGrid.innerHTML = '<p class="text-center text-red-500 col-span-full">Error al cargar los prospectos. Por favor, intente de nuevo más tarde.</p>';
            });
    }

    loadContacts();
});