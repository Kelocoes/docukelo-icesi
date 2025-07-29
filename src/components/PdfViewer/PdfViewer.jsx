export default function PdfViewer({ src }) {
    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
                onClick={() => {
                    const iframe = document.getElementById('pdfViewer-' + src);
                    if (iframe.requestFullscreen) {
                        iframe.requestFullscreen();
                    } else if (iframe.webkitRequestFullscreen) {
                        iframe.webkitRequestFullscreen();
                    } else if (iframe.msRequestFullscreen) {
                        iframe.msRequestFullscreen();
                    }
                }}
                style={{
                    backgroundColor: '#1e40af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '7px 10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginBottom: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#005a8c')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#007cba')}
            >
                Pantalla completa
            </button>
            <div style={{ position: 'relative' }}>
                <iframe
                    id={"pdfViewer-" + src}
                    src={src}
                    width="100%"
                    height="600px"
                    title="Syllabus Computación en Internet 2"
                    allowFullScreen
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <p>
                        Tu navegador no soporta iframes.{' '}
                        <a href={{ src }}>Descarga el PDF aquí</a>.
                    </p>
                </iframe>
            </div>
        </div>
    );
}