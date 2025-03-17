const DeviseID =async () => {
    const fingerprint = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        hardwareConcurrency: navigator.hardwareConcurrency, // CPU Cores
        maxTouchPoints: navigator.maxTouchPoints, // Touchscreen capability
    };

    // WebGL Fingerprint (Graphics Card Info)
    const canvas = document.createElement("canvas");
    const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
        fingerprint.webglVendor = gl.getParameter(gl.VENDOR);
        fingerprint.webglRenderer = gl.getParameter(gl.RENDERER);
    }

    // Convert object to string & hash it for a unique ID
    const fingerprintString = JSON.stringify(fingerprint);
    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(fingerprintString)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const deviceId = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return deviceId;
}

export default DeviseID;