document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.querySelector('.add_doc_button');

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    document.body.appendChild(overlay);

    const pop_up_form = document.createElement("div");
    pop_up_form.classList.add("pop_up_form");
    pop_up_form.innerHTML = `
    
    <div class="overlay"></div>

    <div class="form-content">
        <h2 id="form_title"> Add New Document </h2>
        <label class="label">Document Title:</label>
        <input type='text' id='name' placeholder='Add the Document Title'/>
        
        <label class="label" for="file-upload">Upload your file:</label>
        <input type="file" id="file-upload" name="file" accept="image/*, .pdf, .docx">
        
        <label class="label">Status:</label>
        <select id="status">
            <option value="Pending">Pending</option>
            <option value="Needs Signing">Needs Signing</option>
            <option value="Completed">Completed</option>
        </select>
        
        <button id="close">Add Document</button>
    </div>`;
    document.body.appendChild(pop_up_form);

    const menu = document.createElement('div');
        menu.classList.add('menu');
        menu.innerHTML = `
            <ul>
                <li id="needs_signing_option">Needs Signing</li>
                <li id="complete_option">Completed</li>
                <li id="edit_option">Edit</li>
                <li id="delete_option">Delete</li>
            </ul>`
                
     document.body.appendChild(menu);

     const deleteDocButton = document.createElement('button');
     deleteDocButton.classList.add('deleteDocButton');
     deleteDocButton.textContent = 'Delete Doc'
     document.body.appendChild(deleteDocButton);


    function displayDocuments(searchQuery = ''){
        const documentContainer = document.querySelector('#documents_container');
        documentContainer.innerHTML = '';

        const documents = JSON.parse(localStorage.getItem('documents')) || [];
        

        const filteredDocs = documents.filter(doc => doc.title.toLowerCase().includes(searchQuery.toLowerCase()));

        filteredDocs.map((doc, index) => {
            const row = document.createElement('tr');

            const checkboxCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('doc_checkbox');
            checkbox.dataset.index = index;
            checkboxCell.appendChild(checkbox);
            row.appendChild(checkboxCell);

            const docNameCell = document.createElement('td');
            docNameCell.textContent = doc.title;
            row.appendChild(docNameCell);

            const statusCell = document.createElement('td');
            const statusType = document.createElement('p');
            statusType.textContent = doc.status;
            if(doc.status === 'Needs Signing'){
                statusType.style.backgroundColor = '#436D7C';
                statusType.style.color = 'white';
                statusType.style.padding = '7px 12px';
                statusType.style.display = 'inline-block'; 
                statusType.style.textAlign = 'center'; 
                statusType.style.borderRadius = '100px';
                statusType.style.width = 'fit-content';
            } else if(doc.status === 'Pending'){
                statusType.style.backgroundColor = '#E8ECF1';
                statusType.style.color = '#626D82';
                statusType.style.padding = '7px 12px';
                statusType.style.display = 'inline-block'; 
                statusType.style.textAlign = 'center'; 
                statusType.style.borderRadius = '100px';
                statusType.style.width = 'fit-content';
            } else{
                statusType.style.backgroundColor = '#D3F7B5';
                statusType.style.color = '#1F4451';
                statusType.style.padding = '7px 12px';
                statusType.style.display = 'inline-block'; 
                statusType.style.textAlign = 'center'; 
                statusType.style.borderRadius = '100px';
                statusType.style.width = 'fit-content';
            }

            statusCell.appendChild(statusType);
            row.appendChild(statusCell);

            const lastModifiedCell = document.createElement('td');            
            const lastModifiedContent = document.createElement('div');
            lastModifiedContent.classList.add('last_modified');

            const lastModifiedText = document.createElement('p');
            lastModifiedText.classList.add('last_modified_test');

            const now = new Date(doc.date);
            const formattedDate = now.toLocaleDateString();
            const formattedTime = now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: true});

            lastModifiedText.textContent = `${formattedDate},\n${formattedTime}`;
            lastModifiedText.style.whiteSpace = "pre-line";


            const actionButton = document.createElement('button');
             
                if(doc.status === 'Needs Signing'){
                    actionButton.textContent = 'Sign in';
                } else if(doc.status === 'Pending'){
                    actionButton.textContent = 'Preview';
                } else{
                    actionButton.textContent = 'Download PDF';
                }

            lastModifiedText.appendChild(actionButton);

            const icon = document.createElement('img');
            icon.src = 'assets/more_vert_24dp_5F6368_FILL0_wght400_GRAD0_opsz24 2.svg';
            icon.style.cursor = 'pointer';
            lastModifiedText.appendChild(icon);


            lastModifiedContent.appendChild(lastModifiedText);
            lastModifiedCell.appendChild(lastModifiedContent);
            row.appendChild(lastModifiedCell);

            
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = icon.getBoundingClientRect();
                menu.style.top = `${rect.bottom + window.scrollY}px`;
                menu.style.left = `${rect.left + window.scrollX - 50}px`;
                menu.style.display = 'block';
                overlay.style.display = 'block';
                overlay.style.background = 'none';
                overlay.style.backdropFilter = 'blur(0px)';
                overlay.style.zIndex = '2'

                const row = e.target.closest('tr');
                console.log(row);
                
                menu.dataset.targetRow = row? row.rowIndex : null;
                menu.dataset.targetRow = index;
                console.log(menu.dataset.targetRow);
                
            });                     

            documentContainer.appendChild(row);
        })
        showDeleteButton();
    }

    function showDeleteButton(){
        const checkboxes = document.querySelectorAll('.doc_checkbox:checked');
        deleteDocButton.style.display = checkboxes.length > 0 ? 'block' : 'none';
    }

    document.addEventListener('change', (e) => {
        if(e.target.classList.contains('doc_checkbox')){
            showDeleteButton();
        }        
    })

    deleteDocButton.addEventListener('click', () => {
        let documents = JSON.parse(localStorage.getItem('documents')) || [];

        const selectedCheckboxes = document.querySelectorAll('.doc_checkbox:checked');
        const indexesToDelete = Array.from(selectedCheckboxes).map(val => parseInt(val.dataset.index));
        console.log(indexesToDelete);
        

        documents = documents.filter((_, index) => !indexesToDelete.includes(index));
        console.log(documents);
        

        localStorage.setItem('documents', JSON.stringify(documents));

        displayDocuments();
        document.querySelector('.selectAll').checked = false;

    })

    document.querySelector('.selectAll').addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        
        document.querySelectorAll('.doc_checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        showDeleteButton();
        
        
    })

    menu.querySelector('#delete_option').addEventListener('click', () => {
        const targetRowIndex = menu.dataset.targetRow;
        console.log(targetRowIndex);
        

        if(targetRowIndex != null){
            let document = JSON.parse(localStorage.getItem('documents')) || [];

            document.splice(targetRowIndex, 1);

            localStorage.setItem('documents', JSON.stringify(document));
            
            menu.style.display = 'none';
            displayDocuments();
        }
    });

    menu.querySelector('#needs_signing_option').addEventListener('click', () => {
        const targetRowIndex = menu.dataset.targetRow;
        console.log(targetRowIndex);
        

        if(targetRowIndex != null){
            let document = JSON.parse(localStorage.getItem('documents')) || [];

            if(document[targetRowIndex]){
                document[targetRowIndex].status = 'Needs Signing';
                localStorage.setItem('documents', JSON.stringify(document));
            }
            
            menu.style.display = 'none';
            displayDocuments();
        }
    });

    menu.querySelector('#complete_option').addEventListener('click', () => {
        const targetRowIndex = menu.dataset.targetRow;
        console.log(targetRowIndex);
        

        if(targetRowIndex != null){
            let document = JSON.parse(localStorage.getItem('documents')) || [];

            if(document[targetRowIndex]){
                document[targetRowIndex].status = 'Completed';
                localStorage.setItem('documents', JSON.stringify(document));
            }
            
            menu.style.display = 'none';
            displayDocuments();
        }
    });

    menu.querySelector('#edit_option').addEventListener('click', () => {
        const targetRowIndex = menu.dataset.targetRow;
        console.log(targetRowIndex);
        

        if(targetRowIndex != null){
            let documents = JSON.parse(localStorage.getItem('documents')) || [];

            if(documents[targetRowIndex]){
                pop_up_form.style.display = 'block';
                overlay.style.display = 'block';

                const saveButton = pop_up_form.querySelector('#close');
                saveButton.innerHTML = 'Save Changes';
            
                document.querySelector('#name').value = documents[targetRowIndex].title;
                document.querySelector('#status').value = documents[targetRowIndex].status;

                saveButton.replaceWith(saveButton.cloneNode(true));
                const newSaveButton = pop_up_form.querySelector('#close');

                newSaveButton.addEventListener('click', (e) => {
                    e.preventDefault();
    
                    const title = document.querySelector('#name');
                    const status = document.querySelector('#status');
                    const date = new Date().toISOString();
    
                    const data = {
                        title: title.value,
                        status: status.value,
                        date: date,
                    }
    
                    let documents = JSON.parse(localStorage.getItem('documents')) || [];
                    documents[targetRowIndex].title = data.title;
                    documents[targetRowIndex].status = data.status;
                    documents[targetRowIndex].date = data.date;

                    localStorage.setItem('documents', JSON.stringify(documents));

                    
                    pop_up_form.style.display = "none";
                    overlay.style.display = "none";
                    
                    title.value = '';
                    status.value = 'Pending';
    
                    displayDocuments();
                })
                           
                menu.style.display = 'none';
            }
        }

            
    });


    addButton.addEventListener('click', () => {
        pop_up_form.style.display = 'block';
        overlay.style.display = 'block';
    });

    overlay.addEventListener('click', () => {
        pop_up_form.style.display = "none";
        overlay.style.display = 'none'; 
        menu.style.display = 'none';
        document.querySelector('#name').value = '';
        document.querySelector('#file-upload').value = '';
    });

    const submitButton = pop_up_form.querySelector("#close");
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();

        const title = document.querySelector('#name');
        const file = document.querySelector('#file-upload');
        const status = document.querySelector('#status');
        const date = new Date().toISOString();

        const data = {
            title: title.value,
            file: file.files[0].name,
            status: status.value,
            date: date,
        }

        let documents = JSON.parse(localStorage.getItem('documents')) || [];
        documents.push(data);

        localStorage.setItem('documents', JSON.stringify(documents));
        console.log(documents);
        
        pop_up_form.style.display = "none";
        overlay.style.display = "none";
        
        title.value = '';
        file.value = '';
        status.value = 'Pending';

        displayDocuments();
    });

    const searchBar = document.querySelector('#searchDocs');
    searchBar.addEventListener('input', (e) => {
        const searchQuery = e.target.value;
        displayDocuments(searchQuery);
    })

    displayDocuments();
})
