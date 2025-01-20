(async function () {
  document.addEventListener("DOMContentLoaded", () => {
    const scriptTag = Array.from(document.getElementsByTagName("script")).pop();
    const subdomain = scriptTag.getAttribute("data-subdomain");
    const lastYear = new Date().getFullYear() - 1;

    const style = document.createElement("style");
    style.textContent = `
    .pink-carbon-widget .floating-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #1e293b;
        border: none;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        cursor: pointer;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        padding: 0;
    }
    
    .pink-carbon-widget .floating-button img {
        margin-top:2px;
        width: 70%;
        height: 70%;
        object-fit: contain;
        filter: brightness(0) invert(1);
    }
    
    .pink-carbon-widget .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1e293b;
        border-radius: 8px;
        box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.5);
        padding: 20px;
        width: 90%;
        max-width: 450px;
        z-index: 1001;
        display: none;
        color: #ffffff; 
    }
    
    .pink-carbon-widget .modal.open {
        display: block;
    }
    
    .pink-carbon-widget .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 1000;
        display: none;
    }
    
    .pink-carbon-widget .modal-overlay.open {
        display: block;
    }
    
    .pink-carbon-widget .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        color: #f472b6;
        font-family: monospace;
    }
    
    .pink-carbon-widget .close-button:hover {
        color: white; 
    }

    .pink-carbon-widget form {
        display: flex;
        flex-direction: row; 
        gap: 10px; 
    }    
    
    .pink-carbon-widget form input {
        background: #1e293b; 
        color: white;
        border: 2px solid #64748b; 
        padding: 10px;
        border-radius: 4px;
        outline: none;
        width: 70%;
        box-sizing: border-box;
    }
    
    .pink-carbon-widget form input:focus {
        border-color: #f472b6; 
        box-shadow: 0 0 5px #f472b6;
    }
    
    .pink-carbon-widget form button {
        background: #f472b6; 
        color: #1e293b; 
        border: 2px solid;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        box-sizing: border-box;
        width: 30%;
        text-transform: uppercase;
    }
    
    .pink-carbon-widget form button:hover {
        border: 2px solid #f472b6;
        color: #f472b6;
        background: #1e293b;
    }
    
    .pink-carbon-widget a {
        color: #f472b6;
        text-decoration: none;
    }
    
    .pink-carbon-widget a:hover {
        text-decoration: none;
    }
    .pink-carbon-widget #result {
        padding: 10px;
        font-size: 18px;
    }
    
    .pink-carbon-widget #result p {
        margin: 0;
        line-height: 1.5; 
        text-align: center; 
    }

    .pink-carbon-widget #loading {
        display: none;
        margin: 10px auto;
        width: 20px;
        height: 20px;
        border: 4px solid #f3f4f6;
        border-top: 4px solid #f472b6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    `;
    document.head.appendChild(style);

    const widgetWrapper = document.createElement("div");
    widgetWrapper.className = "pink-carbon-widget";
    document.body.appendChild(widgetWrapper);

    const button = document.createElement("button");
    button.className = "floating-button";
    const widgetImg = document.createElement("img");
    widgetImg.src = "https://pinkcarbon.app/assets/widget/widget-icon.png";
    widgetImg.alt = "Check tax return status";
    button.appendChild(widgetImg);
    widgetWrapper.appendChild(button);

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    const modal = document.createElement("div");
    modal.className = "modal";

    const closeButton = document.createElement("button");
    closeButton.className = "close-button";
    closeButton.innerHTML = "X";

    modal.innerHTML = `
        <div style="line-height: 1.5;">
            <h2 style="margin-bottom: 10px;">Check Your ${lastYear} Tax Return Status</h2>
            <p style="margin-bottom: 15px;">Enter the unique identifier provided to you by your tax representative</p>
            <form id="statusForm" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <label for="uniqueIdentifier" style="display: none;">Unique Identifier</label>
                <input
                    type="text"
                    id="uniqueIdentifier"
                    name="uniqueIdentifier"
                    placeholder="ex: ABC1234"
                    aria-label="Enter your unique identifier"
                />
                <button 
                    type="submit">
                    Submit
                </button>
            </form>
            <div id="result" style="min-height: 40px">
                <div id="loading"></div>
            </div>
            <p style="font-size: 12px; color: #777; text-align: left; margin-top: 10px;">
                Powered by <a href="https://pinkcarbon.app" target="_blank" style="color: #f472b6; text-decoration: none;">Pink Carbon</a>
            </p>
        </div>
    `;
    modal.prepend(closeButton);

    widgetWrapper.appendChild(overlay);
    widgetWrapper.appendChild(modal);

    button.addEventListener("click", () => {
      modal.classList.add("open");
      overlay.classList.add("open");
    });

    closeButton.addEventListener("click", () => {
      modal.classList.remove("open");
      overlay.classList.remove("open");
    });

    overlay.addEventListener("click", () => {
      modal.classList.remove("open");
      overlay.classList.remove("open");
    });

    const form = modal.querySelector("#statusForm");
    const resultDiv = modal.querySelector("#result");
    const submitButton = modal.querySelector('button[type="submit"]');
    const loadingSpinner = modal.querySelector('#loading');

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const uniqueIdentifier = form.querySelector("#uniqueIdentifier").value;
    
        loadingSpinner.style.display = 'block';
        resultDiv.querySelectorAll('p').forEach((p) => p.remove());
        submitButton.disabled = true;
    
        try {    
            const response = await fetch(
                `https://pinkcarbon.app/api/v1/get_status_by_identifier?subdomain=${encodeURIComponent(subdomain)}&return_year=${lastYear}&identifier=${encodeURIComponent(uniqueIdentifier)}`,
                {
                    method: "GET",
                }
            );
    
            let textData = await response.text();
            textData = textData.replace(/^"(.*)"$/, "$1"); // Remove wrapping quotes
    
            loadingSpinner.style.display = 'none';
            if (response.ok) {
                resultDiv.insertAdjacentHTML("beforeend", `<p>${textData}</p>`);
            } else {
                resultDiv.insertAdjacentHTML("beforeend", `<p style="color: red;">Error: ${textData}</p>`);
            }
        } catch (error) {
            loadingSpinner.style.display = 'none'; 
            resultDiv.insertAdjacentHTML(
                "beforeend",
                `<p style="color: red;">Unexpected error: ${error.message || "Unknown error"}</p>`
            );
        } finally {
            setTimeout(() => {
                submitButton.disabled = false;
            }, 2000);
        }
    });
    
  });
})();
