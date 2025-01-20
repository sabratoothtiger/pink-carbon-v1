
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://pinkcarbon.app';
  
    const widgetStyle = `
      div {
        max-width: 450px;
      }
    `;

    const widgetContent = subdomain ? `
    <div style="line-height: 1.5; margin: 0 auto;">
        <h3 style="margin-bottom: 10px;">Check Your Tax Return Status</h3>
        <p style="margin-bottom: 15px;">Enter your unique identifier provided to you by your tax expert to check the status of your tax return.</p>
        <form id="statusForm" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <label for="code" style="display: none;">Unique Identifier</label>
            <input
                type="text"
                id="code"
                name="code"
                placeholder="ex: ABC1234"
                aria-label="Enter your unique identifier"
            />
            <button 
                type="submit">
                Submit
            </button>
        </form>
        <div id="result" style="min-height: 40px"></div>
        <p style="font-size: 12px; color: #777; text-align: left; margin-top: 10px;">
            Powered by <a href="https://pinkcarbon.app" target="_blank" style="color: #f472b6; text-decoration: none;">Pink Carbon</a>
        </p>
    </div>
` :
`
<div style="line-height: 1.5; margin: 0 auto;">
<h3 style="margin-bottom: 10px;">Uh oh!</h3>
<p>Something has gone wrong. Please try again later.</p>
<form id="statusForm" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        </form>
`

;

    const statusFormEventListener = `
        async function(event) {
            event.preventDefault();

            const submitButton = shadowRoot.querySelector('button[type="submit"]');
            const code = shadowRoot.getElementById('code').value;
            const resultDiv = shadowRoot.getElementById('result');
            resultDiv.innerHTML = '<p>Searching...</p>';
            submitButton.disabled = true;

            try {
                // Call the API to fetch data
                const response = await fetch(\`${baseUrl}/api/v1/get_status_by_identifier?subdomain=${subdomain}&return_year=2024&identifier=\${code}\`, {
                    method: 'GET',
                });

                let textData = await response.text(); // Get plain text response
                textData = textData.replace(/^"(.*)"$/, '$1'); // Regex to remove wrapping quotes

                if (response.ok) {
                    resultDiv.innerHTML = '<p>' + textData + '</p>';
                } else {
                    resultDiv.innerHTML = '<p style="color:red;">Error: ' + textData + '</p>';
                }
            } catch (error) {
                resultDiv.innerHTML = '<p style="color:red;">Unexpected error: ' + (error.message || 'Unknown error') + '</p>';
            } finally {
                setTimeout(() => {
                    submitButton.disabled = false;
                }, 2000);
            }
        }
    `
  
    return new Response(
      `
        (function() {
            const style = document.createElement('style');
            style.textContent = \`${widgetStyle}\`;
            const container = document.createElement('div');
            container.innerHTML = \`${widgetContent}\`;
            
            // Create shadow DOM to isolate styling
            const shadowHost = document.createElement('div');
            document.body.appendChild(shadowHost);
            const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(style);
            shadowRoot.appendChild(container);
            shadowRoot.getElementById('statusForm').addEventListener('submit', ${statusFormEventListener} );
        })();
      `,
      {
        headers: { 'Content-Type': 'application/javascript' },
      }
    );
  }
  