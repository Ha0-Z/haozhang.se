// Important to keep
var overlayToggle = false;

// JavaScript function for sending the request
async function createNewIdea() {
    tuggleOverlay('div-overlay');
    
    // Get form values
    const title = document.getElementById('form-title').value;
    const description = document.getElementById('form-description').value;
    const priority = document.getElementById('form-priority').value;
    
    // Create request body
    const requestBody = {
        title: title,
        description: description,
        priority: priority
    };
    
    const api = '/api/request-insert?table=idea';
    
    try {
        const response = await fetch(api, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)  // Send data in request body
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log(result);
        alert(JSON.stringify(result));  // Better formatting for alert
            fetchAndDo('/api/request-fetch?table=idea&type=all',renderItems);
    } catch (error) {
        console.error("Error detected: ", error);
        alert("Error creating new idea: " + error.message);
    }
}

function readIdea(id) {
    console.log(id);
}

// async function createNewIdea() {
//     tuggleOverlay('div-overlay');
//     const title = document.getElementById('form-title').value;
//     const description = document.getElementById('form-description').value;
//     const priority = document.getElementById('form-priority').value;
//     const api = '/api/request-insert?table=idea&title=' + title + '&description=' + description + '&priority=' + priority;

//     await fetch(api,{  
//         method: "POST"
//     }).then(res => res.json())
//     .then(data => {
//         console.log(data);
//         alert(data);
//         return;
//      })

    
// }

function renderItems(items) {
    const undone = document.getElementById('ideas-undone');
    const taken = document.getElementById('ideas-taken');
    undone.innerHTML = '';
    taken.innerHTML = '';

    items.forEach(item => {
        if (item.description == null) {
            item.description = "...";
        }
        if (item.taken == 'N') {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'idea';
            itemDiv.innerHTML = `<h4>${item.id}: ${item.title}</h3><p>${item.description}</p>`;
            itemDiv.addEventListener('click', () => readIdea(item.id));
            undone.appendChild(itemDiv);

        } else{
            const itemDiv = document.createElement('div');
            itemDiv.className = 'idea';
            itemDiv.innerHTML = `<h4>${item.id}: ${item.title}</h3><p>${item.description}</p>`;
            itemDiv.addEventListener('click', () => readIdea(item.id));
            taken.appendChild(itemDiv);

        }
    });
    
}

async function fetchAndDo(api,myFunction) {
    await fetch(api)
    .then(res => res.json())
    .then(data => {
        myFunction(data);
        return;
     })

}

function tuggleOverlay(id) {
    console.log(overlayToggle);
    if (overlayToggle == true) {
        overlayToggle = false;
        return;
    }
    var divStyle = document.getElementById(id);
    if (divStyle.style.display == 'block') {
        divStyle.style.display = 'none';
    } else{
        divStyle.style.display = 'block';

        // document.getElementById(id).style.display = 'block';
    }
}
  

document.onload = fetchAndDo('/api/request-fetch?table=idea&type=all',renderItems);