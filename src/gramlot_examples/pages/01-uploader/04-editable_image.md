# Editable images

Choose a PNG, JPEG or WebP image, adjust its framing and confirm. The first control stores a PNG data URL in the page's Data Bag. The second sends the PNG through the application's upload operation. This demonstration returns a temporary data URL and does not persist the image; an application can instead store the bytes as a server file or in its database and return a displayable URL.

The page explicitly attaches the browser camera provider. If camera access is available, **Take photo** opens a live preview; the camera stops after capture or cancellation and the image opens in the same editor. Browser permissions and a secure context are required.

Where screen capture is available, **Capture screen** opens the browser picker. Select a screen, window or tab; sharing stops after one frame and the same editor lets you frame the result. Browser and operating-system permissions may be required.
