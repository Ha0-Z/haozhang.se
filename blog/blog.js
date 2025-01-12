const blogUrl = "/blog/blog-list.json"
let blogList = {};

// Global object to store fetched blog content
const fetchedBlogs = {};


function displayBlog(blogId) {
    document.getElementById('main-hover').style.display = "block";
    document.body.style.overflow = "hidden";

    loadBlogText(blogId);
}

function hideBlog() {
    document.getElementById('main-hover').style.display = "none";
    document.body.style.overflow = "auto";
}

window.addEventListener('load', () => {
    fetch(blogUrl)
        .then(response => {
            // Check if the fetch was successful
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Parse the JSON response and store it in the blogList variable
            blogList = data["blog-list"];

            // Populate the blog list in the HTML
            populateBlogList(blogList);
        })
        .catch(error => {
            console.error("Error fetching the blog list:", error);
        });
});

// Function to populate the blog list into the <main> element
function populateBlogList(blogs) {
    const main = document.querySelector('main');

    // For each blog item, create a new blog div element
    blogs.reverse().forEach(blog => {
        // Create the blog item div
        const blogItemDiv = document.createElement('div');
        blogItemDiv.classList.add('blog-item');
        blogItemDiv.setAttribute('onclick', `displayBlog(${blog.id})`);

        // Create the title element
        const title = document.createElement('h2');
        title.classList.add('blog-title');
        title.textContent = blog.title;

        // Create the description element
        const description = document.createElement('p');
        description.textContent = blog.discribtion;

        // Create the date and language element
        const dateLang = document.createElement('p');
        dateLang.classList.add('font-gray');
        dateLang.textContent = `${formatDate(blog['date-modified'])}, ${formateLanguage(blog.language)}`;

        // Append all elements to the blog item div
        blogItemDiv.appendChild(title);
        blogItemDiv.appendChild(description);
        blogItemDiv.appendChild(dateLang);

        // Append the blog item div to the main element
        main.appendChild(blogItemDiv);
    });
}

// Format the date as required (e.g., "December 27, 2024")
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formateLanguage(dataStr) {
    switch (dataStr) {
        case "en":
            return "English";
        case "cn":
            return "中文";
        case "sv":
            return "Svenska";
        default:
            return "Unkown";
    }
}
var etst1;


function loadBlogText(id) {
    var url = "/blogs/" + id + ".md";
    
    // Check if the blog content has already been fetched
    if (fetchedBlogs[url]) {
        // If the content is already cached, use it
        const blogBox = document.getElementById("blog-box");
        const mdBlock = document.createElement("md-block");
        mdBlock.innerHTML = fetchedBlogs[url]; // Use the cached content

        blogBox.innerHTML = ""; // Clear previous content
        blogBox.appendChild(mdBlock);
    } else {
        // If the content is not cached, fetch it
        fetch(url)
            .then(response => {
                // Check if the fetch was successful
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then(data => {
                // Store the fetched content in the cache
                fetchedBlogs[url] = data;

                // Add the fetched content to the blog-box
                const blogBox = document.getElementById("blog-box");
                const mdBlock = document.createElement("md-block");
                mdBlock.innerHTML = data;

                blogBox.innerHTML = ""; // Clear previous content
                blogBox.appendChild(mdBlock);
            })
            .catch(error => {
                console.error("Error fetching the blog content:", error);
            });
    }
}
