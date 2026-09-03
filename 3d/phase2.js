/* =========================================================
   SHEERs
   PHASE 02.2 — 3D APFC PRODUCT / INDUSTRIAL REALISM
   ========================================================= */


/* =========================================================
   BASIC SETUP
   ========================================================= */

const container =
    document.getElementById("scene-container");


if (!container) {

    console.error(
        "SHEERs: #scene-container was not found."
    );

}


/* =========================================================
   THREE.JS SCENE
   ========================================================= */

const scene =
    new THREE.Scene();


scene.fog =
    new THREE.FogExp2(
        0x07153D,
        0.035
    );


/* =========================================================
   CAMERA
   ========================================================= */

const camera =
    new THREE.PerspectiveCamera(
        38,
        window.innerWidth /
            window.innerHeight,
        0.1,
        100
    );


camera.position.set(
    6.7,
    3.2,
    11
);


/* =========================================================
   RENDERER
   ========================================================= */

const renderer =
    new THREE.WebGLRenderer({

        antialias: true,

        alpha: true

    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.outputEncoding =
    THREE.sRGBEncoding;


if (container) {

    container.appendChild(
        renderer.domElement
    );

}


/* =========================================================
   LIGHTING
   ========================================================= */

const ambient =
    new THREE.AmbientLight(
        0x8CCEFF,
        0.55
    );


scene.add(
    ambient
);


const keyLight =
    new THREE.DirectionalLight(
        0xFFFFFF,
        2.1
    );


keyLight.position.set(
    5,
    8,
    8
);


scene.add(
    keyLight
);


const cyanLight =
    new THREE.PointLight(
        0x10BCEB,
        5,
        18
    );


cyanLight.position.set(
    4,
    2,
    5
);


scene.add(
    cyanLight
);


const blueLight =
    new THREE.PointLight(
        0x274DFF,
        4,
        20
    );


blueLight.position.set(
    -5,
    2,
    2
);


scene.add(
    blueLight
);


/* =========================================================
   PRODUCT GROUP
   ========================================================= */

const product =
    new THREE.Group();


product.position.set(
    2.5,
    0.3,
    0
);


product.rotation.y =
    -0.16;


scene.add(
    product
);


/* =========================================================
   MATERIALS
   ========================================================= */

const cabinetMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x102C4F,

        metalness: 0.85,

        roughness: 0.27

    });


const edgeMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x0A203B,

        metalness: 0.9,

        roughness: 0.22

    });


const darkMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x020B17,

        metalness: 0.75,

        roughness: 0.3

    });


const cyanMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x10BCEB,

        emissive: 0x10BCEB,

        emissiveIntensity: 2.4,

        metalness: 0.2,

        roughness: 0.25

    });


const glassMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x07172B,

        metalness: 0.55,

        roughness: 0.08,

        transparent: true,

        opacity: 0.92

    });


/* =========================================================
   HELPER
   ========================================================= */

function box(
    width,
    height,
    depth,
    material,
    x,
    y,
    z
) {

    const geometry =
        new THREE.BoxGeometry(
            width,
            height,
            depth
        );


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.position.set(
        x,
        y,
        z
    );


    product.add(
        mesh
    );


    return mesh;

}


/* =========================================================
   MAIN CABINET
   ========================================================= */

const cabinet =
    box(
        4.8,
        6.4,
        1.65,
        cabinetMaterial,
        0,
        0,
        0
    );


/* =========================================================
   SIDE PANELS
   ========================================================= */

box(
    0.18,
    6.1,
    1.8,
    edgeMaterial,
    -2.38,
    0,
    0
);


box(
    0.18,
    6.1,
    1.8,
    edgeMaterial,
    2.38,
    0,
    0
);


/* =========================================================
   TOP PANEL
   ========================================================= */

box(
    4.65,
    0.18,
    1.8,
    edgeMaterial,
    0,
    3.15,
    0
);


/* =========================================================
   BOTTOM PANEL
   ========================================================= */

box(
    4.65,
    0.18,
    1.8,
    darkMaterial,
    0,
    -3.15,
    0
);


/* =========================================================
   FRONT DOOR
   ========================================================= */

const door =
    box(
        4.35,
        5.95,
        0.18,
        glassMaterial,
        0,
        0,
        0.88
    );


/* =========================================================
   DOOR BORDER
   ========================================================= */

function edge(
    w,
    h,
    x,
    y
) {

    box(
        w,
        h,
        0.10,
        edgeMaterial,
        x,
        y,
        1.02
    );

}


edge(
    4.35,
    0.10,
    0,
    2.95
);


edge(
    4.35,
    0.10,
    0,
    -2.95
);


edge(
    0.10,
    5.9,
    -2.12,
    0
);


edge(
    0.10,
    5.9,
    2.12,
    0
);


/* =========================================================
   TOP BRAND PLATE
   ========================================================= */

const brandPlate =
    box(
        2.6,
        0.72,
        0.08,
        darkMaterial,
        0,
        2.42,
        1.10
    );


/* =========================================================
   CYAN BRAND EDGE
   ========================================================= */

box(
    2.6,
    0.035,
    0.04,
    cyanMaterial,
    0,
    2.78,
    1.17
);


/* =========================================================
   DISPLAY PANEL
   ========================================================= */

box(
    3.35,
    1.28,
    0.10,
    darkMaterial,
    0,
    1.25,
    1.10
);


/* =========================================================
   DIGITAL DISPLAY
   ========================================================= */

function createDisplayTexture() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        800;


    canvas.height =
        240;


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle =
        "#041426";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle =
        "#10BCEB";


    ctx.font =
        "bold 70px Arial";


    ctx.fillText(
        "PF  0.95",
        42,
        88
    );


    ctx.fillStyle =
        "#8FE8FF";


    ctx.font =
        "bold 32px Arial";


    ctx.fillText(
        "SYSTEM OPTIMIZED",
        45,
        145
    );


    ctx.fillStyle =
        "#FFFFFF";


    ctx.font =
        "22px Arial";


    ctx.fillText(
        "SHEERs APFC",
        45,
        195
    );


    return new THREE.CanvasTexture(
        canvas
    );

}


const displayTexture =
    createDisplayTexture();


const displayPlaneMaterial =
    new THREE.MeshBasicMaterial({

        map:
            displayTexture,

        transparent:
            true

    });


const displayPlane =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            2.95,
            0.88
        ),

        displayPlaneMaterial

    );


displayPlane.position.set(
    0,
    1.25,
    1.20
);


product.add(
    displayPlane
);


/* =========================================================
   CAPACITOR STAGE SECTION
   ========================================================= */

box(
    3.35,
    2.65,
    0.08,
    darkMaterial,
    0,
    -0.55,
    1.09
);


/* =========================================================
   SECTION DIVIDER
   ========================================================= */

box(
    3.35,
    0.035,
    0.04,
    edgeMaterial,
    0,
    0.70,
    1.16
);


/* =========================================================
   CAPACITOR MODULES
   ========================================================= */

const capacitorModules =
    [];


const capacitorStatusLights =
    [];


for (
    let i = 0;
    i < 4;
    i++
) {

    const x =
        -1.28 +
        i * 0.85;


    const module =
        box(
            0.62,
            1.65,
            0.28,
            cabinetMaterial,
            x,
            -0.55,
            1.22
        );


    capacitorModules.push(
        module
    );


    box(
        0.48,
        0.08,
        0.32,
        edgeMaterial,
        x,
        0.20,
        1.38
    );


    const status =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.065,
                16,
                16
            ),

            cyanMaterial

        );


    status.position.set(
        x,
        -0.02,
        1.43
    );


    product.add(
        status
    );


    capacitorStatusLights.push(
        status
    );

}


/* =========================================================
   LOWER CONTROL AREA
   ========================================================= */

box(
    3.35,
    0.72,
    0.10,
    darkMaterial,
    0,
    -2.15,
    1.10
);


/* =========================================================
   BREAKER
   ========================================================= */

box(
    0.72,
    0.42,
    0.16,
    edgeMaterial,
    -1.15,
    -2.15,
    1.22
);


box(
    0.72,
    0.42,
    0.16,
    edgeMaterial,
    0,
    -2.15,
    1.22
);


box(
    0.72,
    0.42,
    0.16,
    edgeMaterial,
    1.15,
    -2.15,
    1.22
);


/* =========================================================
   BREAKER LEVERS
   ========================================================= */

for (
    let i = -1;
    i <= 1;
    i++
) {

    box(
        0.13,
        0.30,
        0.05,
        cyanMaterial,
        i * 1.15,
        -2.15,
        1.34
    );

}


/* =========================================================
   VENTILATION SLOTS
   ========================================================= */

for (
    let row = 0;
    row < 5;
    row++
) {

    for (
        let col = 0;
        col < 5;
        col++
    ) {

        box(
            0.18,
            0.035,
            0.04,
            darkMaterial,
            -1.65 +
                col * 0.82,
            2.98 -
                row * 0.12,
            1.12
        );

    }

}


/* =========================================================
   SCREWS
   ========================================================= */

const screwMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x8297A8,

        metalness: 0.95,

        roughness: 0.18

    });


function screw(
    x,
    y
) {

    const mesh =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.055,
                0.055,
                0.035,
                16
            ),

            screwMaterial

        );


    mesh.rotation.x =
        Math.PI / 2;


    mesh.position.set(
        x,
        y,
        1.16
    );


    product.add(
        mesh
    );

}


screw(
    -1.95,
    2.65
);


screw(
    1.95,
    2.65
);


screw(
    -1.95,
    -2.65
);


screw(
    1.95,
    -2.65
);


/* =========================================================
   BRAND TEXT
   ========================================================= */

function createBrandTexture() {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        900;


    canvas.height =
        220;


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.fillStyle =
        "#071426";


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.fillStyle =
        "#FFFFFF";


    ctx.font =
        "bold 92px Arial";


    ctx.textAlign =
        "center";


    ctx.fillText(
        "SHEERs",
        450,
        110
    );


    ctx.fillStyle =
        "#10BCEB";


    ctx.font =
        "bold 26px Arial";


    ctx.fillText(
        "INTELLIGENT POWER",
        450,
        165
    );


    return new THREE.CanvasTexture(
        canvas
    );

}


const brandTexture =
    createBrandTexture();


const brandMaterial =
    new THREE.MeshBasicMaterial({

        map:
            brandTexture

    });


const brandPlane =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            2.48,
            0.61
        ),

        brandMaterial

    );


brandPlane.position.set(
    0,
    2.42,
    1.17
);


product.add(
    brandPlane
);


/* =========================================================
   INDUSTRIAL REALISM
   ========================================================= */


/* ---------- Front-door hardware ---------- */

const handleMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x6F879A,

        metalness: 0.95,

        roughness: 0.18

    });


const handleBase =
    box(
        0.20,
        1.18,
        0.10,
        handleMaterial,
        1.78,
        0.25,
        1.18
    );


const handleGrip =
    box(
        0.12,
        0.78,
        0.16,
        handleMaterial,
        1.96,
        0.25,
        1.28
    );


/* ---------- Hinges ---------- */

const hingeMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x314B63,

        metalness: 0.9,

        roughness: 0.24

    });


[-2.0, 0, 2.0].forEach(
    y => {

        box(
            0.20,
            0.46,
            0.12,
            hingeMaterial,
            -2.20,
            y,
            1.17
        );

    }
);


/* ---------- Recessed service panels ---------- */

const recessMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x061322,

        metalness: 0.78,

        roughness: 0.34

    });


box(
    2.92,
    0.12,
    0.035,
    recessMaterial,
    0,
    0.82,
    1.19
);


box(
    2.92,
    0.12,
    0.035,
    recessMaterial,
    0,
    -1.88,
    1.19
);


/* ---------- Capacitor canisters ---------- */

const terminalMaterial =
    new THREE.MeshStandardMaterial({

        color: 0xB7C8D4,

        metalness: 0.95,

        roughness: 0.16

    });


const capacitorCanisters =
    [];


for (
    let i = 0;
    i < 4;
    i++
) {

    const x =
        -1.28 +
        i * 0.85;


    const can =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.22,
                0.22,
                1.28,
                24
            ),

            cabinetMaterial

        );


    can.rotation.z =
        Math.PI / 2;


    can.position.set(
        x,
        -0.55,
        1.43
    );


    product.add(
        can
    );


    capacitorCanisters.push(
        can
    );


    const terminal =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.065,
                0.065,
                0.12,
                16
            ),

            terminalMaterial

        );


    terminal.position.set(
        x,
        0.13,
        1.43
    );


    product.add(
        terminal
    );


    box(
        0.40,
        0.08,
        0.34,
        edgeMaterial,
        x,
        -1.28,
        1.43
    );

}


/* ---------- Solid-state switching ---------- */

const ssrPanelMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x0B233F,

        metalness: 0.72,

        roughness: 0.28

    });


const ssrAccentMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x0D6C98,

        emissive: 0x063B59,

        emissiveIntensity: 1.1,

        metalness: 0.45,

        roughness: 0.24

    });


box(
    3.35,
    0.54,
    0.10,
    ssrPanelMaterial,
    0,
    0.32,
    1.10
);


const ssrModules =
    [];


for (
    let i = 0;
    i < 4;
    i++
) {

    const x =
        -1.28 +
        i * 0.85;


    const ssrModule =
        box(
            0.57,
            0.30,
            0.17,
            ssrPanelMaterial,
            x,
            0.32,
            1.24
        );


    ssrModules.push(
        ssrModule
    );


    box(
        0.34,
        0.045,
        0.025,
        ssrAccentMaterial,
        x,
        0.32,
        1.34
    );


    const terminal =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.035,
                0.035,
                0.06,
                12
            ),

            terminalMaterial

        );


    terminal.position.set(
        x,
        0.12,
        1.29
    );


    product.add(
        terminal
    );

}


/* ---------- Three-phase busbar ---------- */

const busbarMaterials = [

    new THREE.MeshStandardMaterial({

        color: 0x8297A8,

        metalness: 0.95,

        roughness: 0.18

    }),

    new THREE.MeshStandardMaterial({

        color: 0x60788C,

        metalness: 0.95,

        roughness: 0.18

    }),

    new THREE.MeshStandardMaterial({

        color: 0x9DB1BE,

        metalness: 0.95,

        roughness: 0.18

    })

];


for (
    let i = 0;
    i < 3;
    i++
) {

    box(
        2.62,
        0.075,
        0.055,
        busbarMaterials[i],
        0,
        -1.64 +
            i * 0.20,
        1.43
    );

}


/* ---------- Cable channels ---------- */

const cableMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x030A12,

        metalness: 0.25,

        roughness: 0.55

    });


for (
    let i = 0;
    i < 5;
    i++
) {

    const x =
        -1.55 +
        i * 0.775;


    box(
        0.075,
        0.72,
        0.055,
        cableMaterial,
        x,
        -1.92,
        1.44
    );

}


/* ---------- Controller / ESP32 enclosure ---------- */

const controllerMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x122D48,

        metalness: 0.72,

        roughness: 0.30

    });


box(
    1.15,
    0.48,
    0.24,
    controllerMaterial,
    0,
    -2.15,
    1.38
);


box(
    0.74,
    0.035,
    0.03,
    cyanMaterial,
    0,
    -1.98,
    1.52
);


/* ---------- Controller status LEDs ---------- */

const controllerLEDs =
    [];


for (
    let i = 0;
    i < 3;
    i++
) {

    const led =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.035,
                12,
                12
            ),

            cyanMaterial

        );


    led.position.set(
        -0.28 +
            i * 0.28,
        -2.15,
        1.53
    );


    product.add(
        led
    );


    controllerLEDs.push(
        led
    );

}


/* ---------- Cable glands ---------- */

const glandMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x172B40,

        metalness: 0.82,

        roughness: 0.30

    });


for (
    let i = 0;
    i < 6;
    i++
) {

    const x =
        -1.35 +
        i * 0.54;


    const gland =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.105,
                0.105,
                0.12,
                18
            ),

            glandMaterial

        );


    gland.rotation.x =
        Math.PI / 2;


    gland.position.set(
        x,
        -2.78,
        1.13
    );


    product.add(
        gland
    );

}


/* ---------- Additional fasteners ---------- */

function frontBolt(
    x,
    y,
    scale = 1
) {

    const bolt =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.045 * scale,
                0.045 * scale,
                0.035,
                16
            ),

            screwMaterial

        );


    bolt.rotation.x =
        Math.PI / 2;


    bolt.position.set(
        x,
        y,
        1.20
    );


    product.add(
        bolt
    );

}


[
    [-1.72, 1.98],
    [1.72, 1.98],
    [-1.72, -0.10],
    [1.72, -0.10],
    [-1.72, -1.55],
    [1.72, -1.55]
].forEach(
    p => {

        frontBolt(
            p[0],
            p[1]
        );

    }
);


/* ---------- Status glow ---------- */

const statusGlowMaterial =
    new THREE.MeshBasicMaterial({

        color: 0x10BCEB,

        transparent: true,

        opacity: 0.22

    });


const statusGlow =
    new THREE.Mesh(

        new THREE.PlaneGeometry(
            2.70,
            0.035
        ),

        statusGlowMaterial

    );


statusGlow.position.set(
    0,
    0.62,
    1.22
);


product.add(
    statusGlow
);


/* =========================================================
   REALISM ANIMATION STATE
   ========================================================= */

const realismParts = {

    handleBase,

    handleGrip,

    statusGlow,

    ssrAccentMaterial,

    capacitorStatusLights,

    controllerLEDs,

    ssrModules

};


/* =========================================================
   ENERGY GLOW RING
   ========================================================= */

const ringGeometry =
    new THREE.TorusGeometry(
        3.9,
        0.025,
        12,
        120
    );


const ringMaterial =
    new THREE.MeshBasicMaterial({

        color: 0x10BCEB,

        transparent: true,

        opacity: 0.65

    });


const ring =
    new THREE.Mesh(
        ringGeometry,
        ringMaterial
    );


ring.rotation.x =
    Math.PI / 2;


ring.position.set(
    0,
    -2.9,
    0
);


scene.add(
    ring
);


/* =========================================================
   SECOND ENERGY RING
   ========================================================= */

const ring2 =
    new THREE.Mesh(

        new THREE.TorusGeometry(
            4.5,
            0.008,
            12,
            120
        ),

        new THREE.MeshBasicMaterial({

            color: 0x8FE8FF,

            transparent: true,

            opacity: 0.22

        })

    );


ring2.rotation.x =
    Math.PI / 2;


ring2.position.set(
    0,
    -2.92,
    0
);


scene.add(
    ring2
);


/* =========================================================
   FLOOR GRID
   ========================================================= */

const grid =
    new THREE.GridHelper(
        35,
        35,
        0x10BCEB,
        0x12416E
    );


grid.position.y =
    -3.2;


grid.material.transparent =
    true;


grid.material.opacity =
    0.25;


scene.add(
    grid
);


/* =========================================================
   FLOATING PARTICLES
   ========================================================= */

const particleCount =
    350;


const particleGeometry =
    new THREE.BufferGeometry();


const positions =
    new Float32Array(
        particleCount * 3
    );


for (
    let i = 0;
    i < particleCount;
    i++
) {

    const radius =
        7 +
        Math.random() * 8;


    const angle =
        Math.random() *
        Math.PI *
        2;


    positions[i * 3] =
        Math.cos(angle) *
        radius;


    positions[i * 3 + 1] =
        Math.random() *
        9 -
        4;


    positions[i * 3 + 2] =
        Math.sin(angle) *
        radius;

}


particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
        positions,
        3
    )
);


const particleMaterial =
    new THREE.PointsMaterial({

        color: 0x8FE8FF,

        size: 0.035,

        transparent: true,

        opacity: 0.55,

        depthWrite: false

    });


const particles =
    new THREE.Points(
        particleGeometry,
        particleMaterial
    );


scene.add(
    particles
);


/* =========================================================
   MOUSE INTERACTION
   ========================================================= */

let mouseX =
    0;


let mouseY =
    0;


window.addEventListener(
    "mousemove",
    event => {

        mouseX =
            event.clientX /
            window.innerWidth *
            2 -
            1;


        mouseY =
            event.clientY /
            window.innerHeight *
            2 -
            1;

    }
);


/* =========================================================
   MAIN SIMULATION BUTTON
   ========================================================= */

const simulationButton =
    document.getElementById(
        "homeSimulationButton"
    );


if (simulationButton) {

    simulationButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            console.log(
                "SHEERs: View Simulation button clicked."
            );

            window.location.href =
                "phase2.html";

        }
    );

} else {

    console.error(
        "SHEERs: #homeSimulationButton was not found."
    );

}

/* =========================================================
   WEBSITE SECTIONS
   ========================================================= */

const storySection =
    document.getElementById(
        "our-journey"
    );


const productsSection =
    document.getElementById(
        "products"
    );


const apfcProductSection =
    document.getElementById(
        "apfc-product"
    );


const technologySection =
    document.getElementById(
        "technology"
    );


const teamSection =
    document.getElementById(
        "team"
    );


const contactSection =
    document.getElementById(
        "contact"
    );


const navigationLinks =
    document.querySelectorAll(
        ".navigation a[data-section]"
    );


/* =========================================================
   TEAM DATA
   ========================================================= */

const SHEERS_TEAM = {

    roopali: {

        name:
            "Prof. Roopali Palwe",

        role:
            "CEO / Strategy",

        phone:
            "8668655385",

        email:
            "roopali.palwe@mit.asia",

        image:
            "images/roopali.jpg"

    },


    sairaj: {

        name:
            "Sairaj Kharat",

        role:
            "COO / Software",

        phone:
            "9326583206",

        email:
            "sairaj.kharat@mit.asia",

        image:
            "images/sairaj.jpg"

    },


    harshvardhan: {

        name:
            "Harshvardhan Khade",

        role:
            "CTO / Hardware",

        phone:
            "7057493181",

        email:
            "harshvardhan.khade@mit.asia",

        image:
            "images/harshvardhan.jpg"

    }

};


window.SHEERS_TEAM =
    SHEERS_TEAM;


/* =========================================================
   FUTURE SECTIONS
   ========================================================= */

const futureSections = [

    technologySection,

    teamSection,

    contactSection

].filter(
    Boolean
);


/* =========================================================
   HIDE ALL PANELS
   ========================================================= */

function hideAllPanels() {

    const sections = [

        storySection,

        productsSection,

        apfcProductSection,

        technologySection,

        teamSection,

        contactSection

    ];


    sections.forEach(
        section => {

            if (!section) return;


            section.classList.remove(
                "is-open"
            );


            section.setAttribute(
                "aria-hidden",
                "true"
            );

        }
    );

}


/* =========================================================
   NAVIGATION HELPERS
   ========================================================= */

function setActiveNavigation(
    sectionName
) {

    navigationLinks.forEach(
        link => {

            link.classList.toggle(

                "active",

                link.dataset.section ===
                    sectionName

            );

        }
    );

}


/* =========================================================
   HOME
   ========================================================= */

function goHome() {

    hideAllPanels();


    setActiveNavigation(
        "home"
    );


    history.replaceState(
        null,
        "",
        "#home"
    );

}


/* =========================================================
   OUR STORY
   ========================================================= */

function openStory() {

    hideAllPanels();


    if (!storySection) {

        console.warn(
            "SHEERs: #our-journey was not found."
        );

        return;

    }


    storySection.classList.add(
        "is-open"
    );


    storySection.setAttribute(
        "aria-hidden",
        "false"
    );


    setActiveNavigation(
        "story"
    );


    history.replaceState(
        null,
        "",
        "#our-journey"
    );

}


function closeStory() {

    if (!storySection) {

        goHome();

        return;

    }


    storySection.classList.remove(
        "is-open"
    );


    storySection.setAttribute(
        "aria-hidden",
        "true"
    );


    setActiveNavigation(
        "home"
    );


    history.replaceState(
        null,
        "",
        "#home"
    );

}


/* =========================================================
   PRODUCTS
   ========================================================= */

function openProducts() {

    hideAllPanels();


    if (!productsSection) {

        console.warn(
            "SHEERs: #products was not found."
        );

        return;

    }


    productsSection.classList.add(
        "is-open"
    );


    productsSection.setAttribute(
        "aria-hidden",
        "false"
    );


    setActiveNavigation(
        "products"
    );


    history.replaceState(
        null,
        "",
        "#products"
    );

}


function closeProducts() {

    if (!productsSection) {

        goHome();

        return;

    }


    productsSection.classList.remove(
        "is-open"
    );


    productsSection.setAttribute(
        "aria-hidden",
        "true"
    );


    setActiveNavigation(
        "home"
    );


    history.replaceState(
        null,
        "",
        "#home"
    );

}


/* =========================================================
   APFC PRODUCT DETAIL
   ========================================================= */

function openAPFCProduct() {

    hideAllPanels();


    if (!apfcProductSection) {

        console.error(
            "SHEERs: #apfc-product was not found."
        );

        return;

    }


    apfcProductSection.classList.add(
        "is-open"
    );


    apfcProductSection.setAttribute(
        "aria-hidden",
        "false"
    );


    setActiveNavigation(
        "products"
    );


    history.replaceState(
        null,
        "",
        "#apfc-product"
    );

}


function closeAPFCProduct() {

    if (!apfcProductSection) {

        openProducts();

        return;

    }


    apfcProductSection.classList.remove(
        "is-open"
    );


    apfcProductSection.setAttribute(
        "aria-hidden",
        "true"
    );


    openProducts();

}


/* =========================================================
   BACK TO PRODUCTS
   ========================================================= */

function backToProducts() {

    openProducts();

}


/* =========================================================
   FUTURE SECTIONS
   ========================================================= */

function openFutureSection(
    section
) {

    if (!section) {

        console.warn(
            "SHEERs: requested section does not exist."
        );

        return;

    }


    hideAllPanels();


    section.classList.add(
        "is-open"
    );


    section.setAttribute(
        "aria-hidden",
        "false"
    );


    setActiveNavigation(
        section.id
    );


    history.replaceState(
        null,
        "",
        "#" +
            section.id
    );

}


/* =========================================================
   TEAM SECTION
   ========================================================= */

function openTeam() {

    hideAllPanels();


    if (!teamSection) {

        console.warn(
            "SHEERs: Team section #team was not found."
        );

        return;

    }


    setupTeamImages();


    teamSection.classList.add(
        "is-open"
    );


    teamSection.setAttribute(
        "aria-hidden",
        "false"
    );


    setActiveNavigation(
        "team"
    );


    history.replaceState(
        null,
        "",
        "#team"
    );

}


function closeTeam() {

    if (!teamSection) {

        goHome();

        return;

    }


    teamSection.classList.remove(
        "is-open"
    );


    teamSection.setAttribute(
        "aria-hidden",
        "true"
    );


    setActiveNavigation(
        "home"
    );


    history.replaceState(
        null,
        "",
        "#home"
    );

}


/* =========================================================
   CONTACT SECTION
   ========================================================= */

function openContact() {

    hideAllPanels();


    if (!contactSection) {

        console.warn(
            "SHEERs: Contact section #contact was not found."
        );

        return;

    }


    setupContactDisplay();


    contactSection.classList.add(
        "is-open"
    );


    contactSection.setAttribute(
        "aria-hidden",
        "false"
    );


    setActiveNavigation(
        "contact"
    );


    history.replaceState(
        null,
        "",
        "#contact"
    );

}


function closeContact() {

    if (!contactSection) {

        goHome();

        return;

    }


    contactSection.classList.remove(
        "is-open"
    );


    contactSection.setAttribute(
        "aria-hidden",
        "true"
    );


    setActiveNavigation(
        "home"
    );


    history.replaceState(
        null,
        "",
        "#home"
    );

}


/* =========================================================
   TEAM DISPLAY
   ========================================================= */

function setupTeamImages() {

    if (!teamSection) {

        console.warn(
            "SHEERs: Team section #team was not found."
        );

        return;

    }


    const teamContainer =
        teamSection.querySelector(
            "[data-team-container]"
        );


    if (!teamContainer) {

        console.warn(
            "SHEERs: [data-team-container] was not found."
        );

        return;

    }


    teamContainer.innerHTML = "";


    Object.keys(
        SHEERS_TEAM
    ).forEach(
        memberKey => {

            const person =
                SHEERS_TEAM[
                    memberKey
                ];


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "sheers-team-card";


            card.innerHTML = `

                <div
                    class="sheers-team-image-wrapper"
                >

                    <img
                        src="${person.image}"
                        alt="${person.name}"
                        class="sheers-team-image"
                        data-team-image="${memberKey}"
                    >

                </div>


                <div
                    class="sheers-team-info"
                >

                    <h3>
                        ${person.name}
                    </h3>


                    <p>
                        ${person.role}
                    </p>


                    <div
                        class="sheers-team-actions"
                    >

                        <a
                            href="tel:${person.phone}"
                            data-team-call="${memberKey}"
                        >
                            Call
                        </a>


                        <a
                            href="mailto:${person.email}"
                            data-team-email="${memberKey}"
                        >
                            Email
                        </a>

                    </div>

                </div>

            `;


            teamContainer.appendChild(
                card
            );

        }
    );


    setupTeamContactActions();

}


/* =========================================================
   CONTACT DISPLAY
   ========================================================= */

function setupContactDisplay() {

    if (!contactSection) {

        console.warn(
            "SHEERs: Contact section #contact was not found."
        );

        return;

    }


    const contactContainer =
        contactSection.querySelector(
            "[data-contact-container]"
        );


    if (!contactContainer) {

        console.warn(
            "SHEERs: [data-contact-container] was not found."
        );

        return;

    }


    contactContainer.innerHTML = "";


    Object.keys(
        SHEERS_TEAM
    ).forEach(
        memberKey => {

            const person =
                SHEERS_TEAM[
                    memberKey
                ];


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "sheers-contact-card";


            card.innerHTML = `

                <h3>
                    ${person.name}
                </h3>


                <p>
                    ${person.role}
                </p>


                <a
                    href="tel:${person.phone}"
                    data-contact-call="${memberKey}"
                >
                    ${person.phone}
                </a>


                <a
                    href="mailto:${person.email}"
                    data-contact-email="${memberKey}"
                >
                    ${person.email}
                </a>

            `;


            contactContainer.appendChild(
                card
            );

        }
    );


    setupContactActions();

}


/* =========================================================
   TEAM MEMBER CONTACT ACTIONS
   ========================================================= */

function setupTeamContactActions() {

    document
        .querySelectorAll(
            "[data-team-call]"
        )
        .forEach(
            button => {

                if (
                    button.dataset.actionsReady ===
                    "true"
                ) {

                    return;

                }


                button.dataset.actionsReady =
                    "true";


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const member =
                            button.dataset.teamCall;


                        const person =
                            SHEERS_TEAM[
                                member
                            ];


                        if (!person) {

                            console.warn(
                                "SHEERs: Team member not found:",
                                member
                            );

                            return;

                        }


                        window.location.href =
                            "tel:" +
                            person.phone;

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-team-email]"
        )
        .forEach(
            button => {

                if (
                    button.dataset.actionsReady ===
                    "true"
                ) {

                    return;

                }


                button.dataset.actionsReady =
                    "true";


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const member =
                            button.dataset.teamEmail;


                        const person =
                            SHEERS_TEAM[
                                member
                            ];


                        if (!person) {

                            console.warn(
                                "SHEERs: Team member not found:",
                                member
                            );

                            return;

                        }


                        window.location.href =
                            "mailto:" +
                            person.email;

                    }
                );

            }
        );

}


/* =========================================================
   CONTACT CARD ACTIONS
   ========================================================= */

function setupContactActions() {

    document
        .querySelectorAll(
            "[data-contact-call]"
        )
        .forEach(
            button => {

                if (
                    button.dataset.actionsReady ===
                    "true"
                ) {

                    return;

                }


                button.dataset.actionsReady =
                    "true";


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const member =
                            button.dataset.contactCall;


                        const person =
                            SHEERS_TEAM[
                                member
                            ];


                        if (!person) {

                            console.warn(
                                "SHEERs: Contact member not found:",
                                member
                            );

                            return;

                        }


                        window.location.href =
                            "tel:" +
                            person.phone;

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-contact-email]"
        )
        .forEach(
            button => {

                if (
                    button.dataset.actionsReady ===
                    "true"
                ) {

                    return;

                }


                button.dataset.actionsReady =
                    "true";


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const member =
                            button.dataset.contactEmail;


                        const person =
                            SHEERS_TEAM[
                                member
                            ];


                        if (!person) {

                            console.warn(
                                "SHEERs: Contact member not found:",
                                member
                            );

                            return;

                        }


                        window.location.href =
                            "mailto:" +
                            person.email;

                    }
                );

            }
        );

}


/* =========================================================
   EXPLORE SHEERs BUTTON
   ========================================================= */

const exploreButton =
    document.getElementById(
        "exploreButton"
    );


if (exploreButton) {

    exploreButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();

            openStory();

        }
    );

}


/* =========================================================
   MASTER NAVIGATION
   ========================================================= */

navigationLinks.forEach(
    link => {

        if (
            link.dataset.navigationReady ===
            "true"
        ) {

            return;

        }


        link.dataset.navigationReady =
            "true";


        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const section =
                    link.dataset.section;


                console.log(
                    "SHEERs navigation:",
                    section
                );


                if (
                    section === "home"
                ) {

                    goHome();

                    return;

                }


                if (
                    section === "story"
                ) {

                    openStory();

                    return;

                }


                if (
                    section === "products"
                ) {

                    openProducts();

                    return;

                }


                if (
                    section === "technology"
                ) {

                    openFutureSection(
                        technologySection
                    );

                    return;

                }


                if (
                    section === "team"
                ) {

                    openTeam();

                    return;

                }


                if (
                    section === "contact"
                ) {

                    openContact();

                    return;

                }

            }
        );

    }
);


/* =========================================================
   PRODUCT CARD ACTIONS
   ========================================================= */

document
    .querySelectorAll(
        "[data-product-open]"
    )
    .forEach(
        button => {

            if (
                button.dataset.productReady ===
                "true"
            ) {

                return;

            }


            button.dataset.productReady =
                "true";


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    const productName =
                        button.dataset.productOpen;


                    if (
                        productName === "apfc"
                    ) {

                        console.log(
                            "SHEERs Intelligent APFC selected."
                        );


                        openAPFCProduct();

                        return;

                    }


                    if (
                        productName === "concrete"
                    ) {

                        console.log(
                            "Concrete Maturity Meter selected."
                        );

                        return;

                    }


                    if (
                        productName === "windai"
                    ) {

                        console.log(
                            "WindAI Blade Intelligence selected."
                        );

                        return;

                    }

                }
            );

        }
    );


/* =========================================================
   STORY CLOSE BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        "[data-close-story]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    closeStory();

                }
            );

        }
    );


/* =========================================================
   PRODUCTS CLOSE BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        "[data-close-products]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    closeProducts();

                }
            );

        }
    );


/* =========================================================
   APFC CLOSE BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        "[data-close-apfc]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    closeAPFCProduct();

                }
            );

        }
    );


/* =========================================================
   APFC BACK TO PRODUCTS BUTTON
   ========================================================= */

document
    .querySelectorAll(
        "[data-back-products]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    backToProducts();

                }
            );

        }
    );


/* =========================================================
   TEAM CLOSE BUTTON
   ========================================================= */

document
    .querySelectorAll(
        "[data-close-team]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    closeTeam();

                }
            );

        }
    );


/* =========================================================
   CONTACT CLOSE BUTTON
   ========================================================= */

document
    .querySelectorAll(
        "[data-close-contact]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    closeContact();

                }
            );

        }
    );


/* =========================================================
   FUTURE SECTION CLOSE BUTTONS
   ========================================================= */

document
    .querySelectorAll(
        "[data-close-future]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();


                    document
                        .querySelectorAll(
                            ".future-section"
                        )
                        .forEach(
                            section => {

                                section.classList.remove(
                                    "is-open"
                                );


                                section.setAttribute(
                                    "aria-hidden",
                                    "true"
                                );

                            }
                        );


                    document
                        .querySelector(
                            ".interface"
                        )
                        ?.classList.remove(
                            "section-open"
                        );


                    history.replaceState(
                        null,
                        "",
                        "#home"
                    );


                    window.scrollTo({

                        top: 0,

                        behavior:
                            "smooth"

                    });


                    setActiveNavigation(
                        "home"
                    );

                }
            );

        }
    );


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        if (
            apfcProductSection &&
            apfcProductSection.classList.contains(
                "is-open"
            )
        ) {

            closeAPFCProduct();

            return;

        }


        if (
            storySection &&
            storySection.classList.contains(
                "is-open"
            )
        ) {

            closeStory();

            return;

        }


        if (
            productsSection &&
            productsSection.classList.contains(
                "is-open"
            )
        ) {

            closeProducts();

            return;

        }


        if (
            teamSection &&
            teamSection.classList.contains(
                "is-open"
            )
        ) {

            closeTeam();

            return;

        }


        if (
            contactSection &&
            contactSection.classList.contains(
                "is-open"
            )
        ) {

            closeContact();

            return;

        }


        if (
            technologySection &&
            technologySection.classList.contains(
                "is-open"
            )
        ) {

            goHome();

        }

    }
);


/* =========================================================
   HASH NAVIGATION
   ========================================================= */

function handleHash() {

    const hash =
        window.location.hash
            .replace(
                "#",
                ""
            )
            .toLowerCase();


    console.log(
        "SHEERs hash:",
        hash
    );


    if (
        hash === "our-journey"
    ) {

        openStory();

        return;

    }


    if (
        hash === "products"
    ) {

        openProducts();

        return;

    }


    if (
        hash === "apfc-product"
    ) {

        openAPFCProduct();

        return;

    }


    if (
        hash === "technology"
    ) {

        openFutureSection(
            technologySection
        );

        return;

    }


    if (
        hash === "team"
    ) {

        openTeam();

        return;

    }


    if (
        hash === "contact"
    ) {

        openContact();

        return;

    }


    goHome();

}


/* =========================================================
   HASH CHANGE
   ========================================================= */

window.addEventListener(
    "hashchange",
    handleHash
);


/* =========================================================
   INITIALIZATION
   ========================================================= */

setupTeamImages();

setupContactDisplay();

handleHash();


/* =========================================================
   ANIMATION
   ========================================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const time =
        clock.getElapsedTime();


    /* =====================================================
       PRODUCT MOVEMENT
       ===================================================== */

    const targetRotationY =
        -0.16 +
        mouseX *
        0.13;


    product.rotation.y +=
        (
            targetRotationY -
            product.rotation.y
        ) *
        0.045;


    product.rotation.x +=
        (
            mouseY *
            0.035 -
            product.rotation.x
        ) *
        0.04;


    /* =====================================================
       FLOATING
       ===================================================== */

    product.position.y =
        0.3 +
        Math.sin(
            time * 0.75
        ) *
        0.06;


    /* =====================================================
       ENERGY RINGS
       ===================================================== */

    ring.rotation.z =
        time *
        0.12;


    ring2.rotation.z =
        -time *
        0.07;


    /* =====================================================
       PARTICLES
       ===================================================== */

    particles.rotation.y =
        time *
        0.008;


    /* =====================================================
       CYAN LIGHT MOVEMENT
       ===================================================== */

    cyanLight.position.x =
        4 +
        Math.sin(
            time * 0.7
        ) *
        1.5;


    cyanLight.position.y =
        2 +
        Math.cos(
            time * 0.5
        );


    /* =====================================================
       STATUS GLOW ANIMATION
       ===================================================== */

    statusGlow.material.opacity =
        0.16 +
        Math.sin(
            time * 2.0
        ) *
        0.08;


    /* =====================================================
       CAPACITOR STATUS LIGHTS
       ===================================================== */

    capacitorStatusLights.forEach(
        (light, index) => {

            const pulse =
                0.65 +
                Math.sin(
                    time * 2.0 +
                    index * 0.7
                ) *
                0.25;


            light.scale.set(
                pulse,
                pulse,
                pulse
            );

        }
    );


    /* =====================================================
       CONTROLLER LED ANIMATION
       ===================================================== */

    controllerLEDs.forEach(
        (led, index) => {

            const pulse =
                0.75 +
                Math.sin(
                    time * 2.5 +
                    index
                ) *
                0.25;


            led.scale.set(
                pulse,
                pulse,
                pulse
            );

        }
    );


    /* =====================================================
       SSR VISUAL ACTIVITY
       ===================================================== */

    const ssrPulse =
        0.75 +
        Math.sin(
            time * 1.8
        ) *
        0.20;


    realismParts.ssrAccentMaterial.emissiveIntensity =
        ssrPulse;


    /* =====================================================
       CAMERA
       ===================================================== */

    const targetCameraX =
        6.7 +
        mouseX *
        0.35;


    const targetCameraY =
        3.2 -
        mouseY *
        0.20;


    camera.position.x +=
        (
            targetCameraX -
            camera.position.x
        ) *
        0.025;


    camera.position.y +=
        (
            targetCameraY -
            camera.position.y
        ) *
        0.025;


    camera.lookAt(
        1.0,
        0,
        0
    );


    renderer.render(
        scene,
        camera
    );

}


animate();


/* =========================================================
   RESIZE
   ========================================================= */

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );

    }
);