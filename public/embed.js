(async function () {

    const scriptTag = document.currentScript || Array.from(document.getElementsByTagName('script')).pop();
    const subdomain = scriptTag.getAttribute('data-subdomain');

   // Add the subdomain as a query parameter
   const response = await fetch(`https://pinkcarbon.app/api/widget?subdomain=${encodeURIComponent(subdomain)}`, {
    method: 'GET',
    });
    const scriptContent = await response.text();

    // Dynamically inject the script into the page
    const script = document.createElement('script');
    script.textContent = scriptContent;
    document.head.appendChild(script);
})();