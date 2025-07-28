export default function CodeEditor({ src }) {
    return (
        <>
            <iframe
                style={{ "width": "100%", "height": "500px", "border": "0", "borderRadius": "4px", "overflow": "hidden" }}
                title="prueba-react"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                src={src}
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            ></iframe>
        </>
    );
}