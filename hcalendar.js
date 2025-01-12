test = [
    { "alarm": null, "color": "OPAQUE", "create_date": "Sun, 05 Jan 2025 00:00:00 GMT", "date_end": "Fri, 10 Jan 2025 10:00:00 GMT", "date_start": "Fri, 10 Jan 2025 08:00:00 GMT", "id": 1, "last_modified": "Tue, 07 Jan 2025 00:00:00 GMT", "place": "KTH", "routine": null, "sub_task_id": null, "summary": "Exam- Data" }, 
    { "alarm": null, "color": "OPAQUE", "create_date": "Wed, 08 Jan 2025 19:22:28 GMT", "date_end": "Mon, 13 Jan 2025 09:00:00 GMT", "date_start": "Mon, 13 Jan 2025 06:00:00 GMT", "id": 2, "last_modified": "Wed, 08 Jan 2025 19:22:28 GMT", "place": null, "routine": null, "sub_task_id": null, "summary": "wash_clothes" }, 
    { "alarm": null, "color": "OPAQUE", "create_date": "Fri, 10 Jan 2025 13:13:08 GMT", "date_end": "Sat, 11 Jan 2025 15:00:00 GMT", "date_start": "Sat, 11 Jan 2025 12:00:00 GMT", "id": 3, "last_modified": "Fri, 10 Jan 2025 13:13:08 GMT", "place": null, "routine": null, "sub_task_id": null, "summary": "wash" }, 
    { "alarm": null, "color": "OPAQUE", "create_date": "Fri, 10 Jan 2025 13:13:45 GMT", "date_end": "Fri, 17 Jan 2025 23:00:00 GMT", "date_start": "Thu, 16 Jan 2025 23:00:00 GMT", "id": 4, "last_modified": "Fri, 10 Jan 2025 13:13:45 GMT", "place": null, "routine": null, "sub_task_id": null, "summary": "return equpment" }
]

eventBuffer = {};
var amountLogs = 0;

// Fetch data from url then perform data with function
async function fetchPerform(url, myFunction) {
    await fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            myFunction(data);
            return data;
        })

}

async function fetchAndCreateEvents(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        return data.map(event => {
            // Convert dates from string to Date objects
            const startDate = new Date(event.date_start);
            const endDate = new Date(event.date_end);

            return {
                id: event.id,
                title: event.summary,
                start: startDate.toISOString().slice(0, 16).replace('T', ' '), // Format: "YYYY-MM-DD HH:mm"
                end: endDate.toISOString().slice(0, 16).replace('T', ' '),
                location: event.place || '',
                resourceId: 1,
                color: event.color === 'OPAQUE' ? '#779ECB' : event.color, // Default blue for OPAQUE
                extendedProps: {
                    createDate: event.create_date,
                    lastModified: event.last_modified,
                    alarm: event.alarm,
                    routine: event.routine,
                    subTaskId: event.sub_task_id
                }
            };
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}

// First, create the calendar with empty events
const ec = new EventCalendar(document.getElementById('ec'), {
    view: 'timeGridWeek',
    headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek resourceTimeGridWeek,resourceTimelineWeek'
    },
    dateClick: function(test) {
        // Click on the calendar background
        console.log("dateClick has been performed");
        console.log(test);
    },
    eventDrop: function(test) {
        // Move event to other place
        amountLogs++;
        console.log(amountLogs + ": eventDrop has been performed");
        console.log(test);
    },
    select: function(test){
        // Create new event
        amountLogs++;
        console.log(amountLogs + ": select has been performed");
        console.log(test);
        createEvent(test);
    },
    resources: [
        { id: 1, title: 'Resource A' },
        { id: 2, title: 'Resource B' }
    ],
    scrollTime: '09:00:00',
    events: [], // Start with empty events
    views: {
        timeGridWeek: { pointer: true },
        resourceTimeGridWeek: { pointer: true },
        resourceTimelineWeek: {
            pointer: true,
            slotMinTime: '09:00',
            slotMaxTime: '21:00',
            slotWidth: 80,
            resources: [
                { id: 1, title: 'Resource A' },
                { id: 2, title: 'Resource B' },
                { id: 3, title: 'Resource C' },
                { id: 4, title: 'Resource D' },
                { id: 5, title: 'Resource E' },
                { id: 6, title: 'Resource F' },
                { id: 7, title: 'Resource G' },
                { id: 8, title: 'Resource H' },
                {
                    id: 9, title: 'Resource I', children: [
                        { id: 10, title: 'Resource J' },
                        { id: 11, title: 'Resource K' },
                        {
                            id: 12, title: 'Resource L', children: [
                                { id: 13, title: 'Resource M' },
                                { id: 14, title: 'Resource N' },
                                { id: 15, title: 'Resource O' }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    dayMaxEvents: true,
    nowIndicator: true,
    selectable: true
});

function createEvent(eventObj) {
    document.getElementById('new-event').style.display = 'block';
    document.getElementById('event-start').value = eventObj.startStr;
    document.getElementById('event-end').value = eventObj.endStr;


    eventBuffer = eventObj;
}

function finnishEvent() {
    console.log(eventObj.start);

}

// Then load the events
document.getElementById('ec').classList.add('loading');
fetchAndCreateEvents('api/request-fetch?table=event&type=all')
    .then(events => {
        ec.setOption('events', events);
        document.getElementById('ec').classList.remove('loading');
    })
    .catch(error => {
        console.error('Error loading events:', error);
        document.getElementById('ec').classList.remove('loading');
    });

function _pad(num) {
    let norm = Math.floor(Math.abs(num));
    return (norm < 10 ? '0' : '') + norm;
}

// Add this function to allow manual refresh of events
async function refreshEvents() {
    try {
        const events = await fetchAndCreateEvents('api/request-fetch?table=task&type=all');
        ec.setOption('events', events);
    } catch (error) {
        console.error('Error refreshing events:', error);
    }
}

function getEventColor(task) {
    // Example color mapping based on task properties
    if (task.color === 'OPAQUE') {
        return '#779ECB';  // Default blue
    }
    // Add more color mappings as needed
    return '#779ECB';  // Default fallback
}

