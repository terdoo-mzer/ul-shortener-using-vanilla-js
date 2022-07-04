
// Mobile menu toggler
const toggler = document.getElementById('toggler');
const nav = document.querySelector('.nav_myLinks');
const toggleMenu = () => {
    nav.classList.toggle('active')
}
toggler.addEventListener('click', toggleMenu)


// https://stackabuse.com/how-to-copy-to-clipboard-in-javascript-with-the-clipboard-api/
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard

const form = document.getElementById('myForm');
const input = document.getElementById('userUrl');
const result = document.getElementById('url_ouput');
const submit_btn = document.getElementById('sumit_btn');

const submit_btn_text = document.getElementById('submit_btn_text');
const spinner = document.getElementById('spinner');
let arr = [];



form.addEventListener('submit', (e) => {
    e.preventDefault()
    const val = input.value;
    console.log(input.value)
    requestApi(val);
    showLoader();
})

// send request
function requestApi(val) {
    if (val !== '') {
        fetch(`https://api.shrtco.de/v2/shorten?url=${val}`)
            .then(response => {
                if (!response.ok) {
                    console.log('Please check the link and try again again')
                    return
                };
                return response.json();
            })
            .then(data => {
                arr.unshift(data.result)
                setLocStorage(arr)
                // console.log(data.result)
                displayUrl(arr);
                hideLoader();
                // console.log(arr)
            })
    } else {
            hideLoader()
    }

}

// Create and display HTML elements
function displayUrl(arr) {
    result.innerHTML = '';
    arr.forEach(element => {

        const listItem = document.createElement('li');

        const theShortenedLink = document.createElement('span');

        const div = document.createElement('div');
        const theOriginalLink = document.createElement('p');
        const btn = document.createElement('button');

        theOriginalLink.setAttribute('class', 'original_link');
        btn.setAttribute('class', 'copy_btn btn')
        theShortenedLink.setAttribute('class', 'short_link')

        const shortened_link = truncate_original_link(element.original_link)

        btn.innerHTML = 'Copy';
        theShortenedLink.textContent = element.full_short_link;
        theOriginalLink.textContent = shortened_link;

        
        div.prepend(theShortenedLink);
        div.appendChild(btn);
        listItem.appendChild(theOriginalLink);
        listItem.append(div);
        result.appendChild(listItem);

        btn.addEventListener('click', e => {
            copyTextFromElement(theShortenedLink, btn)
        })

    });
}

// If original link is over 60 characters, truncate from the first
// character to the 60th and replace with '...' 
function truncate_original_link(link) {
    if (link.length >= 60) {
        let shortStr = link.slice(0, 60) + '...'
        // console.log(shortStr)
        return shortStr
    } else {
        return link
    }
}

// Store in local storage
function setLocStorage(data) {
    localStorage.setItem('data', JSON.stringify(data));
    displayUrl(data)
}

// Retrive from local storage
function getLocalStore() {
    let reference = localStorage.getItem('data')
    if (reference) {
        arr = JSON.parse(reference);
        // console.log(arr)
        displayUrl(arr);
    } else {
        localStorage.setItem('data', [])
    }
}

getLocalStore() // When page loads, the script always runs

// Copy text to clipboard
function copyTextFromElement(element, btn) {
    let elementText = element.textContent;
    navigator.clipboard.writeText(elementText);
    elementText ? btn.innerHTML = 'Copied!' : alert('failed')

    setTimeout(function changeCopyText() {
        btn.innerHTML = 'Copy' // Chnage button text back after copy
    }, 1000)

}

// Remove button loader and show button text
function hideLoader() {
    submit_btn_text.removeAttribute('hidden');
    spinner.setAttribute('hidden', false);
    submit_btn.disabled = false;
}

// show button loader and remove button text
function showLoader() {
    submit_btn_text.setAttribute('hidden', true);
    spinner.removeAttribute('hidden');
    submit_btn.disabled = true
}

// hideLoader()
// showLoader()
