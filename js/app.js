/* =========================================================
   SHEERs SIMULATOR
   PHASE 1.11

   LIVE LOAD VARIATION
   POWER FACTOR FLUCTUATION
   CLICK-TO-ACTIVATE SHEERs
   APFC CORRECTION
   ELECTRICITY BILL IMPACT
   MOBILE RESPONSIVE UI

   ========================================================= */


/* =========================================================
   1. APPLICATION STATE
   ========================================================= */

const SHEERS_STATE = {

    currentState: "welcome",

    simulationRunning: false,

    sheersActive: false,

    resultsAvailable: false,

    correctionRunning: false,

    fluctuationTimer: null,

    livePF: 0.72,

    capturedBefore: null,

    capturedAfter: null,

    billBefore: null,

    billAfter: null
};


/* =========================================================
   2. ELECTRICAL ENGINE
   ========================================================= */

const SHEERS_ENGINE = {

    targetPowerFactor: 0.95,

    loads: {

        motor: {
            name: "Induction Motor",
            realPower: 22,
            powerFactor: 0.72
        },

        compressor: {
            name: "Air Compressor",
            realPower: 18,
            powerFactor: 0.65
        },

        pump: {
            name: "Industrial Pump",
            realPower: 10,
            powerFactor: 0.66
        }
    },


    /* -----------------------------------------------------
       Calculate electrical condition
       ----------------------------------------------------- */

    calculate() {

        const motor = this.loads.motor;
        const compressor = this.loads.compressor;
        const pump = this.loads.pump;


        const realPower =
            motor.realPower +
            compressor.realPower +
            pump.realPower;


        const motorQ =
            motor.realPower *
            Math.tan(
                Math.acos(
                    motor.powerFactor
                )
            );


        const compressorQ =
            compressor.realPower *
            Math.tan(
                Math.acos(
                    compressor.powerFactor
                )
            );


        const pumpQ =
            pump.realPower *
            Math.tan(
                Math.acos(
                    pump.powerFactor
                )
            );


        const reactivePower =
            motorQ +
            compressorQ +
            pumpQ;


        const apparentPower =
            Math.sqrt(
                Math.pow(realPower, 2) +
                Math.pow(reactivePower, 2)
            );


        const powerFactor =
            realPower /
            apparentPower;


        return {

            realPower,

            reactivePower,

            apparentPower,

            powerFactor
        };
    },


    /* -----------------------------------------------------
       Set system to a desired PF while maintaining
       realistic load behavior.
       ----------------------------------------------------- */

    setSystemPowerFactor(targetPF) {

        const safePF =
            Math.max(
                0.55,
                Math.min(
                    0.95,
                    targetPF
                )
            );


        /*
         * Keep load distribution realistic.
         * Motor remains the dominant load.
         */

        this.loads.motor.powerFactor =
            Math.max(
                0.60,
                Math.min(
                    0.92,
                    safePF - 0.02
                )
            );


        this.loads.compressor.powerFactor =
            Math.max(
                0.55,
                Math.min(
                    0.90,
                    safePF - 0.06
                )
            );


        this.loads.pump.powerFactor =
            Math.max(
                0.56,
                Math.min(
                    0.91,
                    safePF - 0.05
                )
            );


        /*
         * Correct the overall result exactly enough
         * for the visual simulator.
         */

        return this.calculate();
    },


    /* -----------------------------------------------------
       APFC compensation
       ----------------------------------------------------- */

    compensate() {

        const original =
            this.calculate();


        const P =
            original.realPower;


        const Q =
            original.reactivePower;


        const targetPF =
            this.targetPowerFactor;


        const targetReactivePower =
            P *
            Math.tan(
                Math.acos(
                    targetPF
                )
            );


        const compensation =
            Math.max(
                0,
                Q -
                targetReactivePower
            );


        const correctedReactivePower =
            targetReactivePower;


        const correctedApparentPower =
            Math.sqrt(
                Math.pow(P, 2) +
                Math.pow(
                    correctedReactivePower,
                    2
                )
            );


        const correctedPowerFactor =
            P /
            correctedApparentPower;


        return {

            realPower: P,

            originalReactivePower: Q,

            originalApparentPower:
                original.apparentPower,

            originalPowerFactor:
                original.powerFactor,

            targetReactivePower,

            compensation,

            correctedReactivePower,

            correctedApparentPower,

            correctedPowerFactor
        };
    }
};


/* =========================================================
   3. BILLING MODEL
   =========================================================

   IMPORTANT:

   This is a DEMONSTRATION tariff model.

   PF correction does not directly reduce useful kWh.
   The simulated saving comes from:

   1. Lower apparent-power demand
   2. Reduced PF-related surcharge

   Actual utility savings depend on tariff structure.
   ========================================================= */

const SHEERS_TARIFF = {

    operatingHoursPerDay: 12,

    operatingDaysPerMonth: 26,

    energyRate: 8.50,

    demandRate: 280,

    pfSurchargeRate: 0.07,


    calculate(powerState) {

        const monthlyHours =
            this.operatingHoursPerDay *
            this.operatingDaysPerMonth;


        const energyKWh =
            powerState.realPower *
            monthlyHours;


        const energyCharge =
            energyKWh *
            this.energyRate;


        const demandCharge =
            powerState.apparentPower *
            this.demandRate;


        /*
         * Demo tariff assumption:
         * PF below 0.90 attracts a PF-related surcharge.
         */

        const pfSurcharge =
            powerState.powerFactor < 0.90
                ? energyCharge *
                  this.pfSurchargeRate
                : 0;


        const totalBill =
            energyCharge +
            demandCharge +
            pfSurcharge;


        return {

            energyKWh,

            energyCharge,

            demandCharge,

            pfSurcharge,

            totalBill
        };
    }
};


/* =========================================================
   4. DOM INITIALIZATION
   ========================================================= */

function initializeSHEERS() {


    const states = {

        welcome:
            document.getElementById(
                "welcomeState"
            ),

        running:
            document.getElementById(
                "runningState"
            ),

        active:
            document.getElementById(
                "activeState"
            ),

        results:
            document.getElementById(
                "resultsState"
            )
    };


    const systemStatus =
        document.getElementById(
            "systemStatus"
        );


    const statusIndicator =
        document.getElementById(
            "statusIndicator"
        );


    const startSimulation =
        document.getElementById(
            "startSimulation"
        );


    const activateSheers =
        document.getElementById(
            "activateSheers"
        );


    const showResults =
        document.getElementById(
            "showResults"
        );


    const restartSimulation =
        document.getElementById(
            "restartSimulation"
        );


    /* =====================================================
       5. INJECT PHASE 1.11 STYLES
       ===================================================== */

    injectPhase111Styles();


    /* =====================================================
       6. STATE NAVIGATION
       ===================================================== */

    function showState(stateName) {

        Object.values(states).forEach(
            state => {

                if (!state) {
                    return;
                }

                state.classList.remove(
                    "active-state"
                );
            }
        );


        const selected =
            states[stateName];


        if (!selected) {

            console.error(
                "SHEERs state not found:",
                stateName
            );

            return;
        }


        selected.classList.add(
            "active-state"
        );


        SHEERS_STATE.currentState =
            stateName;
    }


    /* =====================================================
       7. SYSTEM STATUS
       ===================================================== */

    function updateSystemStatus(
        text,
        active = false
    ) {

        if (systemStatus) {

            systemStatus.textContent =
                text;
        }


        if (statusIndicator) {

            statusIndicator.classList.toggle(
                "status-active",
                active
            );
        }
    }


    /* =====================================================
       8. MAIN DASHBOARD UPDATE
       ===================================================== */

    function updateMainDashboard(
        electrical
    ) {

        const pf =
            document.getElementById(
                "powerFactorValue"
            );

        const real =
            document.getElementById(
                "realPowerValue"
            );

        const apparent =
            document.getElementById(
                "apparentPowerValue"
            );

        const reactive =
            document.getElementById(
                "reactivePowerValue"
            );

        const state =
            document.getElementById(
                "systemStateValue"
            );


        if (pf) {

            pf.textContent =
                electrical.powerFactor.toFixed(2);
        }


        if (real) {

            real.textContent =
                electrical.realPower.toFixed(1)
                + " kW";
        }


        if (apparent) {

            apparent.textContent =
                electrical.apparentPower.toFixed(1)
                + " kVA";
        }


        if (reactive) {

            reactive.textContent =
                electrical.reactivePower.toFixed(1)
                + " kVAr";
        }


        if (state) {

            state.textContent =
                SHEERS_STATE.sheersActive
                    ? "OPTIMIZED"
                    : "UNCORRECTED";
        }
    }


    /* =====================================================
       9. CREATE LIVE FACTORY SCREEN
       ===================================================== */

    function buildLiveFactoryScreen() {

        if (!states.running) {
            return;
        }


        states.running.innerHTML = `

            <div class="sheers-live-factory">

                <div class="sheers-live-header">

                    <div>

                        <div class="sheers-live-badge">
                            LIVE INDUSTRIAL LOAD
                        </div>

                        <h1>
                            Factory Power System
                        </h1>

                        <p>
                            Electrical demand is changing in real time.
                            Watch the power factor respond to the factory load.
                        </p>

                    </div>

                    <div class="sheers-online-pill">

                        <span></span>

                        FACTORY ONLINE

                    </div>

                </div>


                <div class="sheers-load-grid">

                    <div class="sheers-load-card">

                        <div class="sheers-load-icon">
                            M
                        </div>

                        <div>

                            <strong>
                                Induction Motor
                            </strong>

                            <span>
                                Production drive
                            </span>

                        </div>

                        <b id="liveMotorPower">
                            22 kW
                        </b>

                    </div>


                    <div class="sheers-load-card">

                        <div class="sheers-load-icon">
                            C
                        </div>

                        <div>

                            <strong>
                                Air Compressor
                            </strong>

                            <span>
                                Pneumatic system
                            </span>

                        </div>

                        <b id="liveCompressorPower">
                            18 kW
                        </b>

                    </div>


                    <div class="sheers-load-card">

                        <div class="sheers-load-icon">
                            P
                        </div>

                        <div>

                            <strong>
                                Industrial Pump
                            </strong>

                            <span>
                                Cooling & circulation
                            </span>

                        </div>

                        <b id="livePumpPower">
                            10 kW
                        </b>

                    </div>

                </div>


                <div class="sheers-live-main">


                    <!-- POWER FACTOR METER -->

                    <button
                        id="sheersMeter"
                        class="sheers-meter"
                        type="button"
                    >

                        <div class="sheers-meter-label">
                            LIVE POWER FACTOR
                        </div>

                        <div
                            id="meterPF"
                            class="sheers-meter-value"
                        >
                            0.72
                        </div>

                        <div class="sheers-meter-scale">

                            <div
                                id="meterNeedle"
                                class="sheers-meter-fill"
                            ></div>

                        </div>

                        <div
                            id="meterCondition"
                            class="sheers-meter-condition"
                        >
                            INEFFICIENT CONDITION
                        </div>


                        <div class="sheers-meter-action">

                            <span>
                                CLICK TO ACTIVATE SHEERs
                            </span>

                            <span class="sheers-arrow">
                                →
                            </span>

                        </div>

                    </button>


                    <!-- LIVE ELECTRICAL VALUES -->

                    <div class="sheers-live-values">

                        <div class="sheers-live-value">

                            <span>
                                REAL POWER
                            </span>

                            <strong id="liveRealPower">
                                50.0 kW
                            </strong>

                        </div>


                        <div class="sheers-live-value">

                            <span>
                                APPARENT POWER
                            </span>

                            <strong id="liveApparentPower">
                                73.3 kVA
                            </strong>

                        </div>


                        <div class="sheers-live-value">

                            <span>
                                REACTIVE POWER
                            </span>

                            <strong id="liveReactivePower">
                                53.6 kVAr
                            </strong>

                        </div>


                        <div class="sheers-live-value">

                            <span>
                                PHASE ANGLE
                            </span>

                            <strong id="livePhaseAngle">
                                47.2°
                            </strong>

                        </div>

                    </div>

                </div>


                <div class="sheers-live-warning">

                    <div class="sheers-warning-icon">
                        !
                    </div>

                    <div>

                        <strong>
                            Why is the power factor changing?
                        </strong>

                        <p>
                            Motors, compressors and pumps have
                            inductive characteristics. As their
                            operating conditions change, the reactive
                            demand of the factory also changes.
                        </p>

                    </div>

                </div>


                <div class="sheers-demo-hint">

                    <span>
                        SHEERs INTELLIGENT POWER MANAGEMENT
                    </span>

                    <b>
                        Click the meter when you're ready.
                    </b>

                </div>

            </div>
        `;


        const meter =
            document.getElementById(
                "sheersMeter"
            );


        if (meter) {

            meter.addEventListener(
                "click",
                () => {

                    stopFluctuation();

                    activateSheersSequence();

                }
            );
        }
    }


    /* =====================================================
       10. LIVE LOAD FLUCTUATION
       ===================================================== */

    function startFluctuation() {

        stopFluctuation();


        /*
         * Different realistic factory operating points.
         */

        const operatingPoints = [

            {
                motor: 21,
                compressor: 16,
                pump: 9
            },

            {
                motor: 23,
                compressor: 18,
                pump: 10
            },

            {
                motor: 25,
                compressor: 20,
                pump: 11
            },

            {
                motor: 20,
                compressor: 14,
                pump: 8
            },

            {
                motor: 24,
                compressor: 17,
                pump: 10
            },

            {
                motor: 22,
                compressor: 19,
                pump: 12
            }

        ];


        function updateLiveLoad() {

            if (
                !SHEERS_STATE.simulationRunning ||
                SHEERS_STATE.sheersActive
            ) {
                return;
            }


            const point =
                operatingPoints[
                    Math.floor(
                        Math.random() *
                        operatingPoints.length
                    )
                ];


            SHEERS_ENGINE.loads.motor.realPower =
                point.motor;

            SHEERS_ENGINE.loads.compressor.realPower =
                point.compressor;

            SHEERS_ENGINE.loads.pump.realPower =
                point.pump;


            /*
             * Vary the individual PF values.
             */

            SHEERS_ENGINE.loads.motor.powerFactor =
                randomBetween(
                    0.68,
                    0.80
                );


            SHEERS_ENGINE.loads.compressor.powerFactor =
                randomBetween(
                    0.60,
                    0.74
                );


            SHEERS_ENGINE.loads.pump.powerFactor =
                randomBetween(
                    0.62,
                    0.76
                );


            const electrical =
                SHEERS_ENGINE.calculate();


            SHEERS_STATE.livePF =
                electrical.powerFactor;


            updateLiveFactoryValues(
                electrical
            );


            updateMainDashboard(
                electrical
            );
        }


        updateLiveLoad();


        SHEERS_STATE.fluctuationTimer =
            setInterval(
                updateLiveLoad,
                1100
            );
    }


    function stopFluctuation() {

        if (
            SHEERS_STATE.fluctuationTimer
        ) {

            clearInterval(
                SHEERS_STATE.fluctuationTimer
            );

            SHEERS_STATE.fluctuationTimer =
                null;
        }
    }


    /* =====================================================
       11. UPDATE LIVE FACTORY VALUES
       ===================================================== */

    function updateLiveFactoryValues(
        electrical
    ) {

        const pf =
            document.getElementById(
                "meterPF"
            );


        const fill =
            document.getElementById(
                "meterNeedle"
            );


        const condition =
            document.getElementById(
                "meterCondition"
            );


        const real =
            document.getElementById(
                "liveRealPower"
            );


        const apparent =
            document.getElementById(
                "liveApparentPower"
            );


        const reactive =
            document.getElementById(
                "liveReactivePower"
            );


        const angle =
            document.getElementById(
                "livePhaseAngle"
            );


        if (pf) {

            pf.textContent =
                electrical.powerFactor.toFixed(2);
        }


        if (fill) {

            const percentage =
                Math.max(
                    0,
                    Math.min(
                        100,
                        (
                            electrical.powerFactor -
                            0.55
                        ) /
                        0.40 *
                        100
                    )
                );


            fill.style.width =
                percentage + "%";
        }


        if (condition) {

            if (
                electrical.powerFactor >= 0.90
            ) {

                condition.textContent =
                    "GOOD POWER FACTOR";

                condition.classList.add(
                    "good"
                );

            } else {

                condition.textContent =
                    "INEFFICIENT CONDITION";

                condition.classList.remove(
                    "good"
                );
            }
        }


        if (real) {

            real.textContent =
                electrical.realPower.toFixed(1)
                + " kW";
        }


        if (apparent) {

            apparent.textContent =
                electrical.apparentPower.toFixed(1)
                + " kVA";
        }


        if (reactive) {

            reactive.textContent =
                electrical.reactivePower.toFixed(1)
                + " kVAr";
        }


        if (angle) {

            const phase =
                Math.acos(
                    Math.max(
                        0.01,
                        Math.min(
                            0.9999,
                            electrical.powerFactor
                        )
                    )
                ) *
                180 /
                Math.PI;


            angle.textContent =
                phase.toFixed(1)
                + "°";
        }


        const motor =
            document.getElementById(
                "liveMotorPower"
            );

        const compressor =
            document.getElementById(
                "liveCompressorPower"
            );

        const pump =
            document.getElementById(
                "livePumpPower"
            );


        if (motor) {

            motor.textContent =
                SHEERS_ENGINE.loads.motor.realPower.toFixed(0)
                + " kW";
        }


        if (compressor) {

            compressor.textContent =
                SHEERS_ENGINE.loads.compressor.realPower.toFixed(0)
                + " kW";
        }


        if (pump) {

            pump.textContent =
                SHEERS_ENGINE.loads.pump.realPower.toFixed(0)
                + " kW";
        }
    }


    /* =====================================================
       12. START SIMULATION
       ===================================================== */

    if (startSimulation) {

        startSimulation.addEventListener(
            "click",
            () => {

                SHEERS_STATE.simulationRunning =
                    true;

                SHEERS_STATE.sheersActive =
                    false;

                SHEERS_STATE.resultsAvailable =
                    false;

                SHEERS_STATE.correctionRunning =
                    false;


                SHEERS_STATE.capturedBefore =
                    null;

                SHEERS_STATE.capturedAfter =
                    null;

                SHEERS_STATE.billBefore =
                    null;

                SHEERS_STATE.billAfter =
                    null;


                updateSystemStatus(
                    "FACTORY ONLINE",
                    true
                );


                showState(
                    "running"
                );


                buildLiveFactoryScreen();


                startFluctuation();


                console.log(
                    "SHEERs live industrial simulation started."
                );
            }
        );
    }


    /* =====================================================
       13. ACTIVATE SHEERs
       ===================================================== */

    async function activateSheersSequence() {

        if (
            SHEERS_STATE.correctionRunning
        ) {
            return;
        }


        stopFluctuation();


        SHEERS_STATE.correctionRunning =
            true;

        SHEERS_STATE.sheersActive =
            true;


        updateSystemStatus(
            "SHEERs ANALYZING",
            true
        );


        /*
         * Capture the actual fluctuating condition.
         */

        const before =
            SHEERS_ENGINE.calculate();


        SHEERS_STATE.capturedBefore =
            before;


        SHEERS_STATE.billBefore =
            SHEERS_TARIFF.calculate(
                before
            );


        /*
         * Calculate correction.
         */

        const correction =
            SHEERS_ENGINE.compensate();


        SHEERS_STATE.capturedAfter =
            {

                realPower:
                    correction.realPower,

                reactivePower:
                    correction.correctedReactivePower,

                apparentPower:
                    correction.correctedApparentPower,

                powerFactor:
                    correction.correctedPowerFactor
            };


        SHEERS_STATE.billAfter =
            SHEERS_TARIFF.calculate(
                SHEERS_STATE.capturedAfter
            );


        /*
         * Build active screen.
         */

        buildActiveScreen(
            before,
            correction
        );


        showState(
            "active"
        );


        await runCorrectionAnimation(
            before,
            correction
        );
    }


    /* =====================================================
       14. ACTIVE SCREEN
       ===================================================== */

    function buildActiveScreen(
        before,
        correction
    ) {

        if (!states.active) {
            return;
        }


        states.active.innerHTML = `

            <div class="sheers-correction-screen">

                <div class="sheers-correction-badge">
                    SHEERs INTELLIGENT CONTROL
                </div>


                <h1>
                    SHEERs is correcting the system
                </h1>


                <p class="sheers-correction-subtitle">
                    Reactive demand detected.
                    Intelligent compensation is being applied.
                </p>


                <div class="sheers-correction-card">


                    <div class="sheers-analysis-row">

                        <div>

                            <span>
                                DETECTED POWER FACTOR
                            </span>

                            <strong id="correctionBeforePF">
                                ${before.powerFactor.toFixed(2)}
                            </strong>

                        </div>


                        <div class="sheers-analysis-arrow">
                            →
                        </div>


                        <div>

                            <span>
                                TARGET
                            </span>

                            <strong class="cyan">
                                0.95
                            </strong>

                        </div>

                    </div>


                    <div class="sheers-process">

                        <div
                            id="correctionStatus"
                            class="sheers-process-title"
                        >
                            ANALYZING LOAD
                        </div>


                        <p id="correctionMessage">
                            Measuring voltage and current relationship...
                        </p>


                        <div class="sheers-progress-track">

                            <div
                                id="correctionProgress"
                                class="sheers-progress-fill"
                            ></div>

                        </div>

                    </div>


                    <div class="sheers-correction-values">

                        <div>

                            <span>
                                POWER FACTOR
                            </span>

                            <strong id="correctionPF">
                                ${before.powerFactor.toFixed(2)}
                            </strong>

                        </div>


                        <div>

                            <span>
                                APPARENT POWER
                            </span>

                            <strong id="correctionKVA">
                                ${before.apparentPower.toFixed(1)} kVA
                            </strong>

                        </div>


                        <div>

                            <span>
                                REACTIVE POWER
                            </span>

                            <strong id="correctionKVAR">
                                ${before.reactivePower.toFixed(1)} kVAr
                            </strong>

                        </div>

                    </div>


                    <div class="sheers-stage-row">

                        <div class="sheers-stage">
                            <span>
                                THYRISTOR STAGE 1
                            </span>
                            <strong id="stage1">
                                STANDBY
                            </strong>
                        </div>


                        <div class="sheers-stage">
                            <span>
                                THYRISTOR STAGE 2
                            </span>
                            <strong id="stage2">
                                STANDBY
                            </strong>
                        </div>


                        <div class="sheers-stage">
                            <span>
                                THYRISTOR STAGE 3
                            </span>
                            <strong id="stage3">
                                STANDBY
                            </strong>
                        </div>

                    </div>


                    <div class="sheers-correction-note">

                        <strong>
                            What SHEERs is doing
                        </strong>

                        <p>
                            SHEERs detects reactive demand,
                            calculates the required compensation,
                            and switches the appropriate APFC
                            stages to bring the system toward
                            the target power factor.
                        </p>

                    </div>

                </div>


                <button
                    id="viewCorrectionResults"
                    class="sheers-result-button"
                    disabled
                >
                    CORRECTION IN PROGRESS
                </button>

            </div>
        `;
    }


    /* =====================================================
       15. CORRECTION ANIMATION
       ===================================================== */

    async function runCorrectionAnimation(
        before,
        correction
    ) {

        const status =
            document.getElementById(
                "correctionStatus"
            );


        const message =
            document.getElementById(
                "correctionMessage"
            );


        const progress =
            document.getElementById(
                "correctionProgress"
            );


        const pfElement =
            document.getElementById(
                "correctionPF"
            );


        const kvaElement =
            document.getElementById(
                "correctionKVA"
            );


        const kvarElement =
            document.getElementById(
                "correctionKVAR"
            );


        const stages = [

            document.getElementById(
                "stage1"
            ),

            document.getElementById(
                "stage2"
            ),

            document.getElementById(
                "stage3"
            )
        ];


        status.textContent =
            "SENSING ELECTRICAL CONDITION";


        message.textContent =
            "Voltage and current signals are being analyzed in real time.";


        progress.style.width =
            "12%";


        await wait(1000);


        status.textContent =
            "REACTIVE DEMAND DETECTED";


        message.textContent =
            correction.compensation.toFixed(1)
            +
            " kVAr of compensation is required.";


        progress.style.width =
            "30%";


        await wait(1000);


        status.textContent =
            "APFC STAGE 1 SWITCHING";


        message.textContent =
            "First compensation stage connected.";


        if (stages[0]) {

            stages[0].textContent =
                "ON";

            stages[0].classList.add(
                "on"
            );
        }


        progress.style.width =
            "48%";


        await animateElectricalValues(
            before,
            correction,
            0.25
        );


        await wait(700);


        status.textContent =
            "APFC STAGE 2 SWITCHING";


        message.textContent =
            "Additional reactive compensation applied.";


        if (stages[1]) {

            stages[1].textContent =
                "ON";

            stages[1].classList.add(
                "on"
            );
        }


        progress.style.width =
            "66%";


        await animateElectricalValues(
            before,
            correction,
            0.50
        );


        await wait(700);


        status.textContent =
            "APFC STAGE 3 SWITCHING";


        message.textContent =
            "Fine compensation stage activated.";


        if (stages[2]) {

            stages[2].textContent =
                "ON";

            stages[2].classList.add(
                "on"
            );
        }


        progress.style.width =
            "82%";


        await animateElectricalValues(
            before,
            correction,
            0.75
        );


        await wait(800);


        status.textContent =
            "POWER FACTOR OPTIMIZED";


        message.textContent =
            "Reactive demand compensated. System moved toward target PF.";


        progress.style.width =
            "100%";


        await animateElectricalValues(
            before,
            correction,
            1
        );


        if (pfElement) {

            pfElement.textContent =
                correction.correctedPowerFactor.toFixed(2);
        }


        if (kvaElement) {

            kvaElement.textContent =
                correction.correctedApparentPower.toFixed(1)
                + " kVA";
        }


        if (kvarElement) {

            kvarElement.textContent =
                correction.correctedReactivePower.toFixed(1)
                + " kVAr";
        }


        SHEERS_STATE.correctionRunning =
            false;

        SHEERS_STATE.resultsAvailable =
            true;


        updateSystemStatus(
            "SHEERs ACTIVE",
            true
        );


        const resultButton =
            document.getElementById(
                "viewCorrectionResults"
            );


        if (resultButton) {

            resultButton.disabled =
                false;

            resultButton.textContent =
                "VIEW SAVINGS & RESULTS";


            resultButton.addEventListener(
                "click",
                () => {

                    showResultsScreen();

                }
            );
        }
    }


    /* =====================================================
       16. ANIMATE ELECTRICAL VALUES
       ===================================================== */

    async function animateElectricalValues(
        before,
        correction,
        progress
    ) {

        const pf =
            before.powerFactor +
            (
                correction.correctedPowerFactor -
                before.powerFactor
            ) *
            progress;


        const kva =
            before.apparentPower +
            (
                correction.correctedApparentPower -
                before.apparentPower
            ) *
            progress;


        const kvar =
            before.reactivePower +
            (
                correction.correctedReactivePower -
                before.reactivePower
            ) *
            progress;


        const pfElement =
            document.getElementById(
                "correctionPF"
            );


        const kvaElement =
            document.getElementById(
                "correctionKVA"
            );


        const kvarElement =
            document.getElementById(
                "correctionKVAR"
            );


        if (pfElement) {

            pfElement.textContent =
                pf.toFixed(2);
        }


        if (kvaElement) {

            kvaElement.textContent =
                kva.toFixed(1)
                + " kVA";
        }


        if (kvarElement) {

            kvarElement.textContent =
                kvar.toFixed(1)
                + " kVAr";
        }


        await wait(450);
    }


    /* =====================================================
       17. RESULTS SCREEN
       ===================================================== */

    function showResultsScreen() {

        if (!states.results) {
            return;
        }


        const before =
            SHEERS_STATE.capturedBefore;


        const after =
            SHEERS_STATE.capturedAfter;


        const billBefore =
            SHEERS_STATE.billBefore;


        const billAfter =
            SHEERS_STATE.billAfter;


        if (
            !before ||
            !after ||
            !billBefore ||
            !billAfter
        ) {

            console.error(
                "SHEERs result data unavailable."
            );

            return;
        }


        const apparentReduction =
            (
                (
                    before.apparentPower -
                    after.apparentPower
                )
                /
                before.apparentPower
            )
            *
            100;


        const reactiveReduction =
            (
                (
                    before.reactivePower -
                    after.reactivePower
                )
                /
                before.reactivePower
            )
            *
            100;


        const billSaving =
            billBefore.totalBill -
            billAfter.totalBill;


        const billSavingPercent =
            (
                billSaving /
                billBefore.totalBill
            )
            *
            100;


        states.results.innerHTML = `

            <div class="sheers-results-111">


                <div class="sheers-results-header">

                    <div class="sheers-results-badge">
                        SHEERs RESULTS
                    </div>

                    <h1>
                        The difference is visible.
                    </h1>

                    <p>
                        SHEERs corrected the power factor,
                        reduced reactive demand and improved
                        the simulated monthly billing impact.
                    </p>

                </div>


                <!-- PF HERO -->

                <div class="sheers-pf-hero">

                    <div>

                        <span>
                            POWER FACTOR
                        </span>

                        <strong>
                            ${before.powerFactor.toFixed(2)}
                        </strong>

                    </div>


                    <div class="sheers-big-arrow">
                        →
                    </div>


                    <div class="after">

                        <span>
                            AFTER SHEERs
                        </span>

                        <strong>
                            ${after.powerFactor.toFixed(2)}
                        </strong>

                    </div>

                </div>


                <!-- BILL HERO -->

                <div class="sheers-bill-hero">

                    <div class="sheers-bill-heading">

                        <div>

                            <span>
                                ESTIMATED MONTHLY BILL
                            </span>

                            <h2>
                                Before vs After SHEERs
                            </h2>

                        </div>

                        <div class="sheers-saving-pill">

                            ${billSavingPercent.toFixed(1)}%
                            ESTIMATED SAVING

                        </div>

                    </div>


                    <div class="sheers-bill-comparison">


                        <div class="sheers-bill-card before">

                            <span>
                                BEFORE SHEERs
                            </span>

                            <strong>
                                ₹${formatMoney(
                                    billBefore.totalBill
                                )}
                            </strong>

                            <small>
                                Monthly estimated bill
                            </small>

                        </div>


                        <div class="sheers-bill-arrow">
                            →
                        </div>


                        <div class="sheers-bill-card after">

                            <span>
                                AFTER SHEERs
                            </span>

                            <strong>
                                ₹${formatMoney(
                                    billAfter.totalBill
                                )}
                            </strong>

                            <small>
                                Monthly estimated bill
                            </small>

                        </div>

                    </div>


                    <div class="sheers-saving-result">

                        <div>

                            <span>
                                ESTIMATED MONTHLY SAVING
                            </span>

                            <strong>
                                ₹${formatMoney(
                                    billSaving
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                ANNUALIZED IMPACT
                            </span>

                            <strong>
                                ₹${formatMoney(
                                    billSaving * 12
                                )}
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- ELECTRICAL METRICS -->

                <div class="sheers-result-grid">


                    <div class="sheers-result-card">

                        <span>
                            APPARENT POWER
                        </span>

                        <strong>
                            ${before.apparentPower.toFixed(1)}
                            →
                            ${after.apparentPower.toFixed(1)}
                            kVA
                        </strong>

                        <small>
                            ${apparentReduction.toFixed(1)}%
                            reduction in simulated apparent demand
                        </small>

                    </div>


                    <div class="sheers-result-card">

                        <span>
                            REACTIVE POWER
                        </span>

                        <strong>
                            ${before.reactivePower.toFixed(1)}
                            →
                            ${after.reactivePower.toFixed(1)}
                            kVAr
                        </strong>

                        <small>
                            ${reactiveReduction.toFixed(1)}%
                            reduction in reactive demand
                        </small>

                    </div>


                    <div class="sheers-result-card">

                        <span>
                            REAL POWER
                        </span>

                        <strong>
                            ${before.realPower.toFixed(1)}
                            kW
                        </strong>

                        <small>
                            Useful load power remains
                            unchanged in this model.
                        </small>

                    </div>

                </div>


                <!-- BILL BREAKDOWN -->

                <div class="sheers-breakdown">

                    <div class="sheers-breakdown-title">

                        BILL IMPACT BREAKDOWN

                    </div>


                    <div class="sheers-breakdown-row">

                        <span>
                            Energy charge
                        </span>

                        <strong>
                            ₹${formatMoney(
                                billBefore.energyCharge
                            )}
                        </strong>

                        <strong>
                            ₹${formatMoney(
                                billAfter.energyCharge
                            )}
                        </strong>

                    </div>


                    <div class="sheers-breakdown-row">

                        <span>
                            Demand-related charge
                        </span>

                        <strong>
                            ₹${formatMoney(
                                billBefore.demandCharge
                            )}
                        </strong>

                        <strong>
                            ₹${formatMoney(
                                billAfter.demandCharge
                            )}
                        </strong>

                    </div>


                    <div class="sheers-breakdown-row">

                        <span>
                            PF-related surcharge
                        </span>

                        <strong>
                            ₹${formatMoney(
                                billBefore.pfSurcharge
                            )}
                        </strong>

                        <strong>
                            ₹${formatMoney(
                                billAfter.pfSurcharge
                            )}
                        </strong>

                    </div>

                </div>


                <!-- ENGINEERING NOTE -->

                <div class="sheers-results-note">

                    <strong>
                        Important engineering note
                    </strong>

                    <p>
                        The electricity-bill figures shown here
                        are based on a demonstration tariff model.
                        SHEERs does not claim that power-factor
                        correction directly reduces useful kWh
                        consumption. Actual savings depend on the
                        utility tariff, demand charges, PF penalties,
                        operating hours and site load profile.
                    </p>

                </div>


                <div class="sheers-final-status">

                    <div class="sheers-status-dot"></div>

                    SHEERs SYSTEM OPTIMIZED

                </div>


                <button
                    id="restartSimulationFinal"
                    class="sheers-run-again"
                >
                    RUN SIMULATION AGAIN
                </button>


            </div>
        `;


        showState(
            "results"
        );


        updateSystemStatus(
            "SIMULATION COMPLETE",
            true
        );


        const restart =
            document.getElementById(
                "restartSimulationFinal"
            );


        if (restart) {

            restart.addEventListener(
                "click",
                resetSimulation
            );
        }


        console.log(
            "========== SHEERs PHASE 1.11 =========="
        );


        console.log(
            "Before PF:",
            before.powerFactor.toFixed(3)
        );


        console.log(
            "After PF:",
            after.powerFactor.toFixed(3)
        );


        console.log(
            "Estimated monthly saving:",
            "₹" +
            formatMoney(
                billSaving
            )
        );


        console.log(
            "Estimated saving percentage:",
            billSavingPercent.toFixed(2) +
            "%"
        );
    }


    /* =====================================================
       18. RESET
       ===================================================== */

    function resetSimulation() {

        stopFluctuation();


        SHEERS_STATE.currentState =
            "welcome";

        SHEERS_STATE.simulationRunning =
            false;

        SHEERS_STATE.sheersActive =
            false;

        SHEERS_STATE.resultsAvailable =
            false;

        SHEERS_STATE.correctionRunning =
            false;


        SHEERS_STATE.capturedBefore =
            null;

        SHEERS_STATE.capturedAfter =
            null;

        SHEERS_STATE.billBefore =
            null;

        SHEERS_STATE.billAfter =
            null;


        /*
         * Restore original loads.
         */

        SHEERS_ENGINE.loads.motor.realPower =
            22;

        SHEERS_ENGINE.loads.compressor.realPower =
            18;

        SHEERS_ENGINE.loads.pump.realPower =
            10;


        SHEERS_ENGINE.loads.motor.powerFactor =
            0.72;

        SHEERS_ENGINE.loads.compressor.powerFactor =
            0.65;

        SHEERS_ENGINE.loads.pump.powerFactor =
            0.66;


        const initial =
            SHEERS_ENGINE.calculate();


        updateMainDashboard(
            initial
        );


        updateSystemStatus(
            "SIMULATION READY",
            false
        );


        showState(
            "welcome"
        );


        console.log(
            "SHEERs simulation restarted."
        );
    }


    /* =====================================================
       19. EXISTING ACTIVATE BUTTON
       ===================================================== */

    if (activateSheers) {

        activateSheers.addEventListener(
            "click",
            () => {

                /*
                 * If the user is already on the live
                 * factory screen, use the meter flow.
                 *
                 * Otherwise activation still works.
                 */

                if (
                    SHEERS_STATE.currentState ===
                    "running"
                ) {

                    stopFluctuation();

                    activateSheersSequence();

                } else {

                    SHEERS_STATE.simulationRunning =
                        true;

                    activateSheersSequence();
                }
            }
        );
    }


    /* =====================================================
       20. EXISTING SHOW RESULTS BUTTON
       ===================================================== */

    if (showResults) {

        showResults.addEventListener(
            "click",
            () => {

                if (
                    SHEERS_STATE.capturedBefore &&
                    SHEERS_STATE.capturedAfter
                ) {

                    showResultsScreen();

                } else {

                    activateSheersSequence();
                }
            }
        );
    }


    /* =====================================================
       21. EXISTING RESTART BUTTON
       ===================================================== */

    if (restartSimulation) {

        restartSimulation.addEventListener(
            "click",
            resetSimulation
        );
    }


    /* =====================================================
       22. INITIALIZE
       ===================================================== */

    const initial =
        SHEERS_ENGINE.calculate();


    updateMainDashboard(
        initial
    );


    showState(
        "welcome"
    );


    updateSystemStatus(
        "SIMULATION READY",
        false
    );


    console.log(
        "========================================"
    );


    console.log(
        "SHEERs Phase 1.11 initialized."
    );


    console.log(
        "Real Power:",
        initial.realPower.toFixed(2),
        "kW"
    );


    console.log(
        "Reactive Power:",
        initial.reactivePower.toFixed(2),
        "kVAr"
    );


    console.log(
        "Apparent Power:",
        initial.apparentPower.toFixed(2),
        "kVA"
    );


    console.log(
        "Power Factor:",
        initial.powerFactor.toFixed(3)
    );


    console.log(
        "Target PF:",
        SHEERS_ENGINE.targetPowerFactor
    );


    console.log(
        "========================================"
    );
}


/* =========================================================
   23. UTILITIES
   ========================================================= */

function wait(
    milliseconds
) {

    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                milliseconds
            );
        }
    );
}


function randomBetween(
    min,
    max
) {

    return (
        Math.random() *
        (
            max -
            min
        )
    )
    +
    min;
}


function formatMoney(
    value
) {

    return Math.round(
        value
    ).toLocaleString(
        "en-IN"
    );
}


/* =========================================================
   24. PHASE 1.11 CSS
   ========================================================= */

function injectPhase111Styles() {

    if (
        document.getElementById(
            "sheersPhase111Styles"
        )
    ) {

        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "sheersPhase111Styles";


    style.textContent = `

        /* =================================================
           LIVE FACTORY
           ================================================= */

        .sheers-live-factory {

            width: min(
                1180px,
                calc(100% - 28px)
            );

            margin: 0 auto;

            padding:
                34px
                0
                50px;

            color: #06234a;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            box-sizing: border-box;
        }


        .sheers-live-header {

            display: flex;

            justify-content: space-between;

            align-items: flex-start;

            gap: 24px;

            margin-bottom: 28px;
        }


        .sheers-live-badge {

            display: inline-flex;

            padding:
                9px
                16px;

            border:
                1px solid
                #bceafa;

            border-radius:
                999px;

            background:
                #eefaff;

            color:
                #08aee0;

            font-size:
                12px;

            font-weight:
                800;

            letter-spacing:
                1.7px;
        }


        .sheers-live-header h1 {

            margin:
                16px
                0
                8px;

            font-size:
                clamp(
                    42px,
                    6vw,
                    72px
                );

            line-height:
                .98;

            letter-spacing:
                -3px;

            font-weight:
                900;
        }


        .sheers-live-header p {

            max-width:
                650px;

            margin:
                0;

            color:
                #5c7899;

            font-size:
                17px;

            line-height:
                1.6;
        }


        .sheers-online-pill {

            display: flex;

            align-items: center;

            gap: 9px;

            padding:
                12px
                17px;

            border:
                1px solid
                #bceafa;

            border-radius:
                999px;

            background:
                #f0fbff;

            color:
                #073568;

            font-size:
                12px;

            font-weight:
                800;

            letter-spacing:
                1.2px;

            white-space:
                nowrap;
        }


        .sheers-online-pill span {

            width: 9px;

            height: 9px;

            border-radius:
                50%;

            background:
                #10b7e5;

            box-shadow:
                0 0 0 5px
                rgba(
                    16,
                    183,
                    229,
                    .12
                );
        }


        .sheers-load-grid {

            display: grid;

            grid-template-columns:
                repeat(
                    3,
                    1fr
                );

            gap:
                14px;

            margin-bottom:
                18px;
        }


        .sheers-load-card {

            display: grid;

            grid-template-columns:
                auto
                1fr
                auto;

            align-items: center;

            gap:
                14px;

            padding:
                19px;

            background:
                #ffffff;

            border:
                1px solid
                #c9ebf7;

            border-radius:
                20px;

            box-shadow:
                0 12px 30px
                rgba(
                    7,
                    53,
                    104,
                    .05
                );
        }


        .sheers-load-icon {

            display: grid;

            place-items:
                center;

            width:
                48px;

            height:
                48px;

            border-radius:
                14px;

            background:
                #062b55;

            color:
                #10b7e5;

            font-weight:
                900;

            font-size:
                17px;
        }


        .sheers-load-card strong {

            display: block;

            color:
                #06234a;

            font-size:
                14px;
        }


        .sheers-load-card span {

            display: block;

            margin-top:
                5px;

            color:
                #7790aa;

            font-size:
                12px;
        }


        .sheers-load-card b {

            color:
                #06234a;

            font-size:
                16px;
        }


        .sheers-live-main {

            display: grid;

            grid-template-columns:
                .95fr
                1.05fr;

            gap:
                18px;

            margin-bottom:
                18px;
        }


        /* =================================================
           CLICKABLE METER
           ================================================= */

        .sheers-meter {

            position:
                relative;

            border:
                1px solid
                #bceafa;

            border-radius:
                26px;

            padding:
                32px;

            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #effaff
                );

            color:
                #06234a;

            text-align:
                left;

            cursor:
                pointer;

            box-shadow:
                0 18px 45px
                rgba(
                    7,
                    53,
                    104,
                    .08
                );

            transition:
                transform .2s ease,
                box-shadow .2s ease;
        }


        .sheers-meter:hover {

            transform:
                translateY(-3px);

            box-shadow:
                0 24px 55px
                rgba(
                    7,
                    53,
                    104,
                    .13
                );
        }


        .sheers-meter:active {

            transform:
                scale(.99);
        }


        .sheers-meter-label {

            color:
                #6683a4;

            font-size:
                12px;

            font-weight:
                800;

            letter-spacing:
                1.8px;
        }


        .sheers-meter-value {

            margin:
                14px
                0
                12px;

            font-size:
                clamp(
                    62px,
                    8vw,
                    92px
                );

            line-height:
                .95;

            font-weight:
                900;

            letter-spacing:
                -4px;
        }


        .sheers-meter-scale {

            height:
                12px;

            overflow:
                hidden;

            border-radius:
                999px;

            background:
                #e2edf3;
        }


        .sheers-meter-fill {

            height:
                100%;

            width:
                40%;

            border-radius:
                inherit;

            background:
                linear-gradient(
                    90deg,
                    #073568,
                    #10b7e5
                );

            transition:
                width .6s ease;
        }


        .sheers-meter-condition {

            margin-top:
                14px;

            color:
                #073568;

            font-size:
                12px;

            font-weight:
                800;

            letter-spacing:
                1.2px;
        }


        .sheers-meter-condition.good {

            color:
                #078fc1;
        }


        .sheers-meter-action {

            display:
                flex;

            justify-content:
                space-between;

            align-items:
                center;

            margin-top:
                30px;

            padding-top:
                18px;

            border-top:
                1px solid
                #dcebf2;

            color:
                #08aee0;

            font-size:
                12px;

            font-weight:
                900;

            letter-spacing:
                1px;
        }


        .sheers-arrow {

            font-size:
                25px;
        }


        /* =================================================
           LIVE VALUES
           ================================================= */

        .sheers-live-values {

            display:
                grid;

            grid-template-columns:
                repeat(
                    2,
                    1fr
                );

            gap:
                14px;
        }


        .sheers-live-value {

            padding:
                25px;

            background:
                #ffffff;

            border:
                1px solid
                #c9ebf7;

            border-radius:
                20px;

            display:
                flex;

            flex-direction:
                column;

            justify-content:
                space-between;
        }


        .sheers-live-value span {

            color:
                #6b84a2;

            font-size:
                11px;

            font-weight:
                800;

            letter-spacing:
                1.5px;
        }


        .sheers-live-value strong {

            margin-top:
                18px;

            color:
                #073568;

            font-size:
                clamp(
                    24px,
                    4vw,
                    36px
                );

            font-weight:
                900;
        }


        /* =================================================
           WARNING
           ================================================= */

        .sheers-live-warning {

            display:
                flex;

            align-items:
                flex-start;

            gap:
                15px;

            padding:
                22px;

            background:
                #f4f8fb;

            border:
                1px solid
                #dce9f0;

            border-radius:
                20px;
        }


        .sheers-warning-icon {

            display:
                grid;

            place-items:
                center;

            min-width:
                38px;

            height:
                38px;

            border-radius:
                50%;

            background:
                #062b55;

            color:
                #10b7e5;

            font-weight:
                900;
        }


        .sheers-live-warning strong {

            color:
                #073568;

            font-size:
                14px;
        }


        .sheers-live-warning p {

            margin:
                7px
                0
                0;

            color:
                #6683a4;

            font-size:
                13px;

            line-height:
                1.55;
        }


        .sheers-demo-hint {

            display:
                flex;

            justify-content:
                space-between;

            gap:
                20px;

            margin-top:
                17px;

            color:
                #6983a0;

            font-size:
                11px;

            font-weight:
                800;

            letter-spacing:
                1.2px;
        }


        .sheers-demo-hint b {

            color:
                #10aede;
        }


        /* =================================================
           CORRECTION SCREEN
           ================================================= */

        .sheers-correction-screen {

            width:
                min(
                    1100px,
                    calc(
                        100% - 28px
                    )
                );

            margin:
                0 auto;

            padding:
                40px
                0
                55px;

            color:
                #06234a;

            font-family:
                Arial,
                Helvetica,
                sans-serif;

            text-align:
                center;
        }


        .sheers-correction-badge {

            display:
                inline-flex;

            padding:
                10px
                18px;

            border:
                1px solid
                #bceafa;

            border-radius:
                999px;

            background:
                #eefaff;

            color:
                #08aee0;

            font-size:
                12px;

            font-weight:
                900;

            letter-spacing:
                1.8px;
        }


        .sheers-correction-screen h1 {

            margin:
                18px
                0
                10px;

            font-size:
                clamp(
                    40px,
                    6vw,
                    68px
                );

            line-height:
                1;

            letter-spacing:
                -2px;

            font-weight:
                900;
        }


        .sheers-correction-subtitle {

            margin:
                0
                auto
                28px;

            max-width:
                680px;

            color:
                #5d7899;

            font-size:
                17px;

            line-height:
                1.6;
        }


        .sheers-correction-card {

            padding:
                30px;

            background:
                #ffffff;

            border:
                1px solid
                #bceafa;

            border-radius:
                25px;

            box-shadow:
                0 20px 55px
                rgba(
                    7,
                    53,
                    104,
                    .08
                );

            text-align:
                left;
        }


        .sheers-analysis-row {

            display:
                grid;

            grid-template-columns:
                1fr
                auto
                1fr;

            align-items:
                center;

            gap:
                20px;

            padding:
                8px
                0
                25px;

            text-align:
                center;

            border-bottom:
                1px solid
                #e1edf3;
        }


        .sheers-analysis-row span {

            display:
                block;

            color:
                #6b84a2;

            font-size:
                11px;

            font-weight:
                800;

            letter-spacing:
                1.5px;
        }


        .sheers-analysis-row strong {

            display:
                block;

            margin-top:
                8px;

            color:
                #073568;

            font-size:
                38px;

            font-weight:
                900;
        }


        .sheers-analysis-row strong.cyan {

            color:
                #10b7e5;
        }


        .sheers-analysis-arrow {

            color:
                #10b7e5;

            font-size:
                35px;

            font-weight:
                900;
        }


        .sheers-process {

            padding:
                27px
                0;
        }


        .sheers-process-title {

            color:
                #073568;

            font-size:
                18px;

            font-weight:
                900;

            letter-spacing:
                .5px;
        }


        .sheers-process p {

            margin:
                7px
                0
                18px;

            color:
                #6882a1;

            font-size:
                14px;
        }


        .sheers-progress-track {

            height:
                10px;

            overflow:
                hidden;

            border-radius:
                999px;

            background:
                #e5edf2;
        }


        .sheers-progress-fill {

            height:
                100%;

            width:
                0%;

            border-radius:
                inherit;

            background:
                linear-gradient(
                    90deg,
                    #073568,
                    #10b7e5
                );

            transition:
                width .4s ease;
        }


        .sheers-correction-values {

            display:
                grid;

            grid-template-columns:
                repeat(
                    3,
                    1fr
                );

            gap:
                14px;
        }


        .sheers-correction-values > div {

            padding:
                21px;

            border-radius:
                18px;

            background:
                #f5f9fc;

            border:
                1px solid
                #e0edf4;
        }


        .sheers-correction-values span {

            display:
                block;

            color:
                #6b84a2;

            font-size:
                10px;

            font-weight:
                800;

            letter-spacing:
                1.5px;
        }


        .sheers-correction-values strong {

            display:
                block;

            margin-top:
                11px;

            color:
                #073568;

            font-size:
                27px;

            font-weight:
                900;
        }


        .sheers-stage-row {

            display:
                grid;

            grid-template-columns:
                repeat(
                    3,
                    1fr
                );

            gap:
                12px;

            margin-top:
                14px;
        }


        .sheers-stage {

            display:
                flex;

            justify-content:
                space-between;

            gap:
                10px;

            padding:
                17px;

            border:
                1px solid
                #cfe9f4;

            border-radius:
                15px;

            color:
                #6b84a2;

            font-size:
                11px;

            font-weight:
                800;

            letter-spacing:
                .8px;
        }


        .sheers-stage strong {

            color:
                #8b9caf;
        }


        .sheers-stage strong.on {

            color:
                #10b7e5;
        }


        .sheers-correction-note {

            margin-top:
                18px;

            padding:
                20px;

            border-radius:
                18px;

            background:
                #f3f8fc;
        }


        .sheers-correction-note strong {

            color:
                #073568;

            font-size:
                13px;
        }


        .sheers-correction-note p {

            margin:
                7px
                0
                0;

            color:
                #6882a1;

            font-size:
                13px;

            line-height:
                1.6;
        }


        .sheers-result-button,
        .sheers-run-again {

            margin-top:
                22px;

            min-width:
                230px;

            padding:
                16px
                25px;

            border:
                0;

            border-radius:
                14px;

            background:
                linear-gradient(
                    135deg,
                    #10b7e5,
                    #148fd0
                );

            color:
                #ffffff;

            font-size:
                13px;

            font-weight:
                900;

            letter-spacing:
                1px;

            cursor:
                pointer;

            box-shadow:
                0 13px 30px
                rgba(
                    16,
                    183,
                    229,
                    .20
                );
        }


        .sheers-result-button:disabled {

            opacity:
                .55;

            cursor:
                default;
        }


        /* =================================================
           RESULTS
           ================================================= */

        .sheers-results-111 {

            width:
                min(
                    1200px,
                    calc(
                        100% - 28px
                    )
                );

            margin:
                0 auto;

            padding:
                36px
                0
                60px;

            color:
                #06234a;

            font-family:
                Arial,
                Helvetica,
                sans-serif;
        }


        .sheers-results-header {

            text-align:
                center;

            margin-bottom:
                25px;
        }


        .sheers-results-badge {

            display:
                inline-flex;

            padding:
                9px
                17px;

            border:
                1px solid
                #bceafa;

            border-radius:
                999px;

            background:
                #eefaff;

            color:
                #08aee0;

            font-size:
                11px;

            font-weight:
                900;

            letter-spacing:
                1.7px;
        }


        .sheers-results-header h1 {

            margin:
                17px
                0
                9px;

            font-size:
                clamp(
                    42px,
                    6vw,
                    70px
                );

            line-height:
                1;

            letter-spacing:
                -3px;

            font-weight:
                900;
        }


        .sheers-results-header p {

            max-width:
                700px;

            margin:
                0 auto;

            color:
                #5d7899;

            font-size:
                16px;

            line-height:
                1.6;
        }


        .sheers-pf-hero {

            display:
                grid;

            grid-template-columns:
                1fr
                auto
                1fr;

            align-items:
                center;

            gap:
                20px;

            padding:
                28px;

            margin-bottom:
                18px;

            background:
                #ffffff;

            border:
                1px solid
                #c4eaf6;

            border-radius:
                24px;

            text-align:
                center;

            box-shadow:
                0 14px 40px
                rgba(
                    7,
                    53,
                    104,
                    .06
                );
        }


        .sheers-pf-hero span {

            display:
                block;

            color:
                #6b84a2;

            font-size:
                11px;

            font-weight:
                900;

            letter-spacing:
                1.6px;
        }


        .sheers-pf-hero strong {

            display:
                block;

            margin-top:
                8px;

            font-size:
                clamp(
                    48px,
                    7vw,
                    72px
                );

            font-weight:
                900;
        }


        .sheers-pf-hero .after strong {

            color:
                #10b7e5;
        }


        .sheers-big-arrow {

            color:
                #10b7e5;

            font-size:
                38px;

            font-weight:
                900;
        }


        /* BILL */

        .sheers-bill-hero {

            padding:
                28px;

            margin-bottom:
                18px;

            border:
                1px solid
                #bceafa;

            border-radius:
                25px;

            background:
                linear-gradient(
                    145deg,
                    #ffffff,
                    #effaff
                );

            box-shadow:
                0 18px 48px
                rgba(
                    7,
                    53,
                    104,
                    .08
                );
        }


        .sheers-bill-heading {

            display:
                flex;

            justify-content:
                space-between;

            align-items:
                center;

            gap:
                20px;

            margin-bottom:
                23px;
        }


        .sheers-bill-heading span {

            color:
                #08aee0;

            font-size:
                11px;

            font-weight:
                900;

            letter-spacing:
                1.6px;
        }


        .sheers-bill-heading h2 {

            margin:
                8px
                0
                0;

            font-size:
                27px;
        }


        .sheers-saving-pill {

            padding:
                12px
                16px;

            border:
                1px solid
                #bceafa;

            border-radius:
                999px;

            background:
                #f1fbff;

            color:
                #08aee0;

            font-size:
                11px;

            font-weight:
                900;

            letter-spacing:
                1px;

            white-space:
                nowrap;
        }


        .sheers-bill-comparison {

            display:
                grid;

            grid-template-columns:
                1fr
                auto
                1fr;

            align-items:
                center;

            gap:
                18px;
        }


        .sheers-bill-card {

            padding:
                25px;

            border-radius:
                19px;

            background:
                #ffffff;

            border:
                1px solid
                #d5eaf2;
        }


        .sheers-bill-card.after {

            background:
                #f0fbff;

            border-color:
                #bceafa;
        }


        .sheers-bill-card span {

            display:
                block;

            color:
                #6b84a2;

            font-size:
                11px;

            font-weight:
                900;

            letter-spacing:
                1.5px;
        }


        .sheers-bill-card strong {

            display:
                block;

            margin-top:
                12px;

            color:
                #073568;

            font-size:
                clamp(
                    32px,
                    5vw,
                    48px
                );

            font-weight:
                900;
        }


        .sheers-bill-card.after strong {

            color:
                #10b7e5;
        }


        .sheers-bill-card small {

            display:
                block;

            margin-top:
                7px;

            color:
                #7690aa;

            font-size:
                12px;
        }


        .sheers-bill-arrow {

            color:
                #10b7e5;

            font-size:
                32px;

            font-weight:
                900;
        }


        .sheers-saving-result {

            display:
                grid;

            grid-template-columns:
                1fr
                1fr;

            gap:
                14px;

            margin-top:
                14px;
        }


        .sheers-saving-result > div {

            padding:
                19px;

            border-radius:
                17px;

            background:
                #062b55;

            color:
                #ffffff;
        }


        .sheers-saving-result span {

            display:
                block;

            color:
                #9ec1db;

            font-size:
                10px;

            font-weight:
                800;

            letter-spacing:
                1.4px;
        }


        .sheers-saving-result strong {

            display:
                block;

            margin-top:
                7px;

            font-size:
                28px;

            color:
                #ffffff;
        }


        /* METRICS */

        .sheers-result-grid {

            display:
                grid;

            grid-template-columns:
                repeat(
                    3,
                    1fr
                );

            gap:
                14px;

            margin-bottom:
                18px;
        }


        .sheers-result-card {

            padding:
                25px;

            background:
                #ffffff;

            border:
                1px solid
                #cfeaf5;

            border-radius:
                20px;
        }


        .sheers-result-card span {

            display:
                block;

            color:
                #6b84a2;

            font-size:
                11px;

            font-weight:
                900;

            letter-spacing:
                1.5px;
        }


        .sheers-result-card strong {

            display:
                block;

            margin-top:
                14px;

            color:
                #073568;

            font-size:
                26px;

            font-weight:
                900;
        }


        .sheers-result-card small {

            display:
                block;

            margin-top:
                9px;

            color:
                #7089a4;

            line-height:
                1.5;

            font-size:
                12px;
        }


        /* BREAKDOWN */

        .sheers-breakdown {

            padding:
                25px;

            margin-bottom:
                18px;

            background:
                #ffffff;

            border:
                1px solid
                #d2eaf3;

            border-radius:
                21px;
        }


        .sheers-breakdown-title {

            margin-bottom:
                15px;

            color:
                #08aee0;

            font-size:
                11px;

            font-weight:
                900;

            letter-spacing:
                1.7px;
        }


        .sheers-breakdown-row {

            display:
                grid;

            grid-template-columns:
                1fr
                170px
                170px;

            gap:
                15px;

            align-items:
                center;

            padding:
                14px
                0;

            border-bottom:
                1px solid
                #e4eef3;

            font-size:
                13px;
        }


        .sheers-breakdown-row:last-child {

            border-bottom:
                0;
        }


        .sheers-breakdown-row span {

            color:
                #6683a4;
        }


        .sheers-breakdown-row strong {

            color:
                #073568;

            text-align:
                right;
        }


        /* NOTE */

        .sheers-results-note {

            padding:
                20px;

            margin-bottom:
                18px;

            background:
                #f4f8fb;

            border:
                1px solid
                #dce8ef;

            border-radius:
                18px;

            text-align:
                center;
        }


        .sheers-results-note strong {

            color:
                #073568;

            font-size:
                12px;
        }


        .sheers-results-note p {

            max-width:
                850px;

            margin:
                8px
                auto
                0;

            color:
                #6a83a0;

            font-size:
                12px;

            line-height:
                1.6;
        }


        .sheers-final-status {

            display:
                flex;

            justify-content:
                center;

            align-items:
                center;

            gap:
                9px;

            margin:
                20px
                0
                0;

            color:
                #073568;

            font-size:
                12px;

            font-weight:
                900;

            letter-spacing:
                1.5px;
        }


        .sheers-status-dot {

            width:
                9px;

            height:
                9px;

            border-radius:
                50%;

            background:
                #10b7e5;

            box-shadow:
                0 0 0 5px
                rgba(
                    16,
                    183,
                    229,
                    .12
                );
        }


        .sheers-run-again {

            display:
                block;

            margin:
                20px
                auto
                0;
        }


        /* =================================================
           MOBILE
           ================================================= */

        @media (
            max-width: 800px
        ) {

            .sheers-live-header {

                flex-direction:
                    column;
            }


            .sheers-online-pill {

                align-self:
                    flex-start;
            }


            .sheers-load-grid {

                grid-template-columns:
                    1fr;
            }


            .sheers-live-main {

                grid-template-columns:
                    1fr;
            }


            .sheers-live-values {

                grid-template-columns:
                    1fr
                    1fr;
            }


            .sheers-correction-values {

                grid-template-columns:
                    1fr;
            }


            .sheers-stage-row {

                grid-template-columns:
                    1fr;
            }


            .sheers-result-grid {

                grid-template-columns:
                    1fr;
            }


            .sheers-bill-heading {

                flex-direction:
                    column;

                align-items:
                    flex-start;
            }


            .sheers-bill-comparison {

                grid-template-columns:
                    1fr;
            }


            .sheers-bill-arrow {

                text-align:
                    center;

                transform:
                    rotate(90deg);
            }


            .sheers-saving-result {

                grid-template-columns:
                    1fr;
            }


            .sheers-breakdown-row {

                grid-template-columns:
                    1fr
                    1fr;

            }


            .sheers-breakdown-row span {

                grid-column:
                    1 / -1;
            }


            .sheers-breakdown-row strong {

                text-align:
                    left;
            }


            .sheers-pf-hero {

                grid-template-columns:
                    1fr;
            }


            .sheers-big-arrow {

                transform:
                    rotate(90deg);
            }


            .sheers-demo-hint {

                flex-direction:
                    column;
            }
        }


        @media (
            max-width: 500px
        ) {

            .sheers-live-factory,
            .sheers-correction-screen,
            .sheers-results-111 {

                width:
                    calc(
                        100% - 20px
                    );

                padding-top:
                    22px;
            }


            .sheers-live-header h1 {

                font-size:
                    42px;
            }


            .sheers-live-header p {

                font-size:
                    14px;
            }


            .sheers-meter {

                padding:
                    24px;
            }


            .sheers-meter-value {

                font-size:
                    66px;
            }


            .sheers-live-values {

                grid-template-columns:
                    1fr;
            }


            .sheers-analysis-row {

                grid-template-columns:
                    1fr;
            }


            .sheers-analysis-arrow {

                transform:
                    rotate(90deg);
            }


            .sheers-correction-card {

                padding:
                    20px;
            }


            .sheers-results-header h1 {

                font-size:
                    42px;
            }


            .sheers-bill-hero {

                padding:
                    20px;
            }
        }

    `;


    document.head.appendChild(
        style
    );
}


/* =========================================================
   25. DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSHEERS
    );

} else {

    initializeSHEERS();
}
/* ============================================================
   SHEERs PHASE 2.1
   INTELLIGENT LOAD ANALYSIS ENGINE
   ============================================================ */

(function () {

    console.log("SHEERs Phase 2.1 Intelligence Engine loaded.");

    /* ------------------------------------------------------------
       CONFIGURATION
       ------------------------------------------------------------ */

    const SHEERS_TARGET_PF = 0.95;

    /*
       These values are used only if the existing simulator
       does not expose the live values directly.
    */

    const fallbackState = {
        realPower: 56.0,
        powerFactor: 0.70,
        reactivePower: 57.8,
        apparentPower: 80.5
    };

    /* ------------------------------------------------------------
       CREATE INTELLIGENCE PANEL
       ------------------------------------------------------------ */

    function createIntelligencePanel() {

        // Prevent duplicate panels
        if (document.getElementById("sheers-intelligence-panel")) {
            return;
        }

        const panel = document.createElement("section");

        panel.id = "sheers-intelligence-panel";

        panel.innerHTML = `
            <div class="sheers-intelligence-header">

                <div>
                    <div class="sheers-eyebrow">
                        SHEERs INTELLIGENCE
                    </div>

                    <h2>
                        Intelligent Load Analysis
                    </h2>

                    <p>
                        SHEERs is continuously analyzing the factory's
                        electrical condition and reactive demand.
                    </p>
                </div>

                <div id="sheers-analysis-status"
                     class="sheers-analysis-status">
                    ANALYZING
                </div>

            </div>


            <div class="sheers-intelligence-grid">

                <!-- LOAD CONDITION -->

                <div class="sheers-intelligence-card">

                    <div class="sheers-card-label">
                        LOAD CONDITION
                    </div>

                    <div id="sheers-load-condition"
                         class="sheers-card-value">
                        NORMAL LOAD
                    </div>

                    <div id="sheers-load-description"
                         class="sheers-card-description">
                        Factory load is operating within the expected range.
                    </div>

                </div>


                <!-- POWER FACTOR -->

                <div class="sheers-intelligence-card">

                    <div class="sheers-card-label">
                        PF ASSESSMENT
                    </div>

                    <div id="sheers-pf-assessment"
                         class="sheers-card-value">
                        MODERATE
                    </div>

                    <div class="sheers-card-description">
                        Current power factor:
                        <strong id="sheers-intelligence-pf">
                            0.70
                        </strong>
                    </div>

                </div>


                <!-- REACTIVE DEMAND -->

                <div class="sheers-intelligence-card">

                    <div class="sheers-card-label">
                        REACTIVE DEMAND
                    </div>

                    <div id="sheers-reactive-demand"
                         class="sheers-card-value">
                        57.8 kVAr
                    </div>

                    <div class="sheers-card-description">
                        Reactive power currently required by the load.
                    </div>

                </div>


                <!-- TARGET -->

                <div class="sheers-intelligence-card">

                    <div class="sheers-card-label">
                        TARGET POWER FACTOR
                    </div>

                    <div class="sheers-card-value">
                        0.95
                    </div>

                    <div class="sheers-card-description">
                        SHEERs correction target.
                    </div>

                </div>


                <!-- COMPENSATION -->

                <div class="sheers-intelligence-card sheers-highlight-card">

                    <div class="sheers-card-label">
                        COMPENSATION REQUIRED
                    </div>

                    <div id="sheers-compensation-required"
                         class="sheers-card-value">
                        0.0 kVAr
                    </div>

                    <div id="sheers-compensation-description"
                         class="sheers-card-description">
                        Calculating required compensation.
                    </div>

                </div>


                <!-- RECOMMENDATION -->

                <div class="sheers-intelligence-card sheers-recommendation-card">

                    <div class="sheers-card-label">
                        SHEERs RECOMMENDATION
                    </div>

                    <div id="sheers-recommendation"
                         class="sheers-card-value">
                        MONITOR SYSTEM
                    </div>

                    <div id="sheers-recommendation-description"
                         class="sheers-card-description">
                        SHEERs is monitoring the electrical condition.
                    </div>

                </div>

            </div>


            <div class="sheers-analysis-footer">

                <div class="sheers-analysis-indicator">
                    <span id="sheers-analysis-dot"></span>
                    LIVE ANALYSIS
                </div>

                <div id="sheers-analysis-message">
                    Waiting for live electrical data...
                </div>

            </div>
        `;


        /*
           Insert after the main dashboard content.

           We try several possible locations so this remains
           compatible with the existing simulator structure.
        */

        const candidates = [
            ".dashboard",
            ".main-content",
            ".container",
            "main"
        ];

        let inserted = false;

        for (const selector of candidates) {

            const target = document.querySelector(selector);

            if (target) {

                target.appendChild(panel);

                inserted = true;

                break;
            }
        }

        if (!inserted) {
            document.body.appendChild(panel);
        }

        injectIntelligenceStyles();
    }


    /* ------------------------------------------------------------
       PHASE 2.1 STYLING
       ------------------------------------------------------------ */

    function injectIntelligenceStyles() {

        if (document.getElementById("sheers-phase-21-styles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "sheers-phase-21-styles";

        style.textContent = `

            #sheers-intelligence-panel {

                width: calc(100% - 20px);

                margin: 30px auto;

                padding: 34px;

                box-sizing: border-box;

                background: rgba(255,255,255,0.96);

                border: 1px solid #bdeaff;

                border-radius: 28px;

                box-shadow:
                    0 20px 50px rgba(8,48,91,0.08);

                font-family:
                    Arial,
                    Helvetica,
                    sans-serif;
            }


            .sheers-intelligence-header {

                display: flex;

                justify-content: space-between;

                align-items: flex-start;

                gap: 25px;

                margin-bottom: 28px;
            }


            .sheers-eyebrow {

                font-size: 13px;

                font-weight: 800;

                letter-spacing: 3px;

                color: #08aee0;

                margin-bottom: 10px;
            }


            .sheers-intelligence-header h2 {

                margin: 0;

                font-size: 32px;

                font-weight: 800;

                color: #06244d;
            }


            .sheers-intelligence-header p {

                margin: 10px 0 0;

                font-size: 16px;

                line-height: 1.6;

                color: #5d7da5;

                max-width: 720px;
            }


            .sheers-analysis-status {

                padding: 12px 18px;

                border-radius: 30px;

                border: 1px solid #bdeaff;

                background: #eefaff;

                color: #079fd0;

                font-size: 12px;

                font-weight: 800;

                letter-spacing: 1.5px;

                white-space: nowrap;
            }


            .sheers-intelligence-grid {

                display: grid;

                grid-template-columns:
                    repeat(3, minmax(0, 1fr));

                gap: 16px;
            }


            .sheers-intelligence-card {

                padding: 24px;

                min-height: 145px;

                box-sizing: border-box;

                background: #f5f9fd;

                border: 1px solid #e0edf7;

                border-radius: 20px;

                transition:
                    transform 0.25s ease,
                    box-shadow 0.25s ease;
            }


            .sheers-intelligence-card:hover {

                transform: translateY(-3px);

                box-shadow:
                    0 12px 30px rgba(7,48,91,0.08);
            }


            .sheers-highlight-card {

                background:
                    linear-gradient(
                        135deg,
                        #eefaff,
                        #f7fcff
                    );

                border-color: #b8e9fa;
            }


            .sheers-recommendation-card {

                background:
                    linear-gradient(
                        135deg,
                        #062d5b,
                        #0b477e
                    );

                border-color: #0b477e;
            }


            .sheers-recommendation-card
            .sheers-card-label {

                color: #75dcff;
            }


            .sheers-recommendation-card
            .sheers-card-value {

                color: white;
            }


            .sheers-recommendation-card
            .sheers-card-description {

                color: #c8e2f4;
            }


            .sheers-card-label {

                font-size: 11px;

                font-weight: 800;

                letter-spacing: 2px;

                color: #6884a7;

                margin-bottom: 12px;
            }


            .sheers-card-value {

                font-size: 25px;

                font-weight: 800;

                color: #062e61;

                line-height: 1.2;

                margin-bottom: 9px;
            }


            .sheers-card-description {

                font-size: 13px;

                line-height: 1.5;

                color: #6683a7;
            }


            .sheers-analysis-footer {

                display: flex;

                justify-content: space-between;

                align-items: center;

                gap: 15px;

                margin-top: 22px;

                padding-top: 18px;

                border-top: 1px solid #e3edf5;

                color: #6480a2;

                font-size: 13px;
            }


            .sheers-analysis-indicator {

                display: flex;

                align-items: center;

                gap: 9px;

                font-weight: 800;

                letter-spacing: 1px;

                color: #0a5b91;
            }


            #sheers-analysis-dot {

                width: 9px;

                height: 9px;

                display: inline-block;

                border-radius: 50%;

                background: #0bb4df;

                box-shadow:
                    0 0 0 5px rgba(11,180,223,0.12);

                animation:
                    sheersPulse 1.5s infinite;
            }


            @keyframes sheersPulse {

                0% {
                    opacity: 1;
                    transform: scale(1);
                }

                50% {
                    opacity: 0.45;
                    transform: scale(0.75);
                }

                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }


            @media (max-width: 900px) {

                #sheers-intelligence-panel {

                    padding: 24px;

                    width: calc(100% - 16px);
                }

                .sheers-intelligence-grid {

                    grid-template-columns:
                        repeat(2, minmax(0, 1fr));
                }
            }


            @media (max-width: 600px) {

                #sheers-intelligence-panel {

                    padding: 20px;

                    border-radius: 22px;
                }


                .sheers-intelligence-header {

                    flex-direction: column;
                }


                .sheers-intelligence-header h2 {

                    font-size: 25px;
                }


                .sheers-intelligence-grid {

                    grid-template-columns: 1fr;
                }


                .sheers-analysis-footer {

                    flex-direction: column;

                    align-items: flex-start;
                }
            }

        `;

        document.head.appendChild(style);
    }


    /* ------------------------------------------------------------
       FIND LIVE ELECTRICAL VALUES
       ------------------------------------------------------------ */

    function getLiveValue(label, fallback) {

        /*
           First try common IDs used by the simulator.
        */

        const possibleIds = {

            powerFactor: [
                "powerFactor",
                "power-factor",
                "pf",
                "live-pf",
                "current-pf"
            ],

            realPower: [
                "realPower",
                "real-power",
                "realPowerValue"
            ],

            apparentPower: [
                "apparentPower",
                "apparent-power",
                "apparentPowerValue"
            ],

            reactivePower: [
                "reactivePower",
                "reactive-power",
                "reactivePowerValue"
            ]
        };


        const ids = possibleIds[label] || [];

        for (const id of ids) {

            const element = document.getElementById(id);

            if (element) {

                const number = parseFloat(
                    element.textContent
                        .replace(/[^0-9.-]/g, "")
                );

                if (Number.isFinite(number)) {
                    return number;
                }
            }
        }


        /*
           Search visible text around known labels.
        */

        const allElements = document.querySelectorAll(
            "div, span, p, strong, h1, h2, h3"
        );

        for (const element of allElements) {

            const text = element.textContent.trim();

            if (
                text &&
                text.toLowerCase().includes(label.toLowerCase())
            ) {

                const parent = element.parentElement;

                if (!parent) continue;

                const numberMatch =
                    parent.textContent.match(
                        /[-+]?\d*\.?\d+/
                    );

                if (numberMatch) {

                    const value =
                        parseFloat(numberMatch[0]);

                    if (Number.isFinite(value)) {
                        return value;
                    }
                }
            }
        }


        return fallback;
    }


    /* ------------------------------------------------------------
       ELECTRICAL CALCULATIONS
       ------------------------------------------------------------ */

    function calculateReactivePower(realPower, pf) {

        if (
            !Number.isFinite(realPower) ||
            !Number.isFinite(pf) ||
            pf <= 0 ||
            pf > 1
        ) {
            return 0;
        }

        const angle =
            Math.acos(pf);

        return Math.abs(
            realPower * Math.tan(angle)
        );
    }


    function calculateApparentPower(realPower, pf) {

        if (
            !Number.isFinite(realPower) ||
            !Number.isFinite(pf) ||
            pf <= 0
        ) {
            return 0;
        }

        return realPower / pf;
    }


    function calculateRequiredCompensation(realPower, currentPF) {

        if (
            !Number.isFinite(realPower) ||
            !Number.isFinite(currentPF)
        ) {
            return 0;
        }


        if (
            currentPF >= SHEERS_TARGET_PF
        ) {
            return 0;
        }


        const currentAngle =
            Math.acos(
                Math.min(
                    Math.max(currentPF, 0.01),
                    0.9999
                )
            );


        const targetAngle =
            Math.acos(
                SHEERS_TARGET_PF
            );


        const compensation =
            realPower *
            (
                Math.tan(currentAngle) -
                Math.tan(targetAngle)
            );


        return Math.max(
            0,
            compensation
        );
    }


    /* ------------------------------------------------------------
       LOAD CLASSIFICATION
       ------------------------------------------------------------ */

    function classifyLoad(realPower) {

        if (realPower < 30) {

            return {
                title: "LOW LOAD",
                description:
                    "Factory demand is relatively low."
            };

        }


        if (realPower < 50) {

            return {
                title: "NORMAL LOAD",
                description:
                    "Factory load is operating within the expected range."
            };

        }


        if (realPower < 70) {

            return {
                title: "HIGH LOAD",
                description:
                    "Multiple industrial loads are demanding significant power."
            };

        }


        return {
            title: "VERY HIGH LOAD",
            description:
                "Heavy industrial demand detected across the system."
        };
    }


    /* ------------------------------------------------------------
       POWER FACTOR CLASSIFICATION
       ------------------------------------------------------------ */

    function classifyPowerFactor(pf) {

        if (pf >= 0.90) {

            return {
                title: "OPTIMAL",
                message:
                    "Power factor is operating close to the target."
            };

        }


        if (pf >= 0.80) {

            return {
                title: "MODERATE",
                message:
                    "Reactive demand is beginning to increase."
            };

        }


        if (pf >= 0.65) {

            return {
                title: "LOW",
                message:
                    "High reactive demand is affecting system efficiency."
            };

        }


        return {
            title: "CRITICAL",
            message:
                "Very high reactive demand detected."
        };
    }


    /* ------------------------------------------------------------
       RECOMMENDATION ENGINE
       ------------------------------------------------------------ */

    function generateRecommendation(pf, compensation) {

        if (pf >= 0.95) {

            return {
                title: "MONITOR SYSTEM",
                description:
                    "Power factor is already at the SHEERs target."
            };

        }


        if (pf >= 0.90) {

            return {
                title: "LIGHT CORRECTION",
                description:
                    "Small reactive compensation may be sufficient."
            };

        }


        if (pf >= 0.80) {

            return {
                title: "PREPARE COMPENSATION",
                description:
                    "SHEERs should prepare compensation stages."
            };

        }


        if (pf >= 0.65) {

            return {
                title: "ACTIVATE COMPENSATION",
                description:
                    `Approximately ${compensation.toFixed(1)} kVAr
                     of compensation is required.`
            };

        }


        return {
            title: "HIGH COMPENSATION REQUIRED",
            description:
                "Critical reactive demand detected. Multiple stages may be required."
        };
    }


    /* ------------------------------------------------------------
       UPDATE INTELLIGENCE
       ------------------------------------------------------------ */

    function updateIntelligence() {

        const panel =
            document.getElementById(
                "sheers-intelligence-panel"
            );

        if (!panel) return;


        /*
           Read values from the current simulator.
        */

        let realPower =
            getLiveValue(
                "realPower",
                fallbackState.realPower
            );


        let powerFactor =
            getLiveValue(
                "powerFactor",
                fallbackState.powerFactor
            );


        let reactivePower =
            getLiveValue(
                "reactivePower",
                fallbackState.reactivePower
            );


        let apparentPower =
            getLiveValue(
                "apparentPower",
                fallbackState.apparentPower
            );


        /*
           Sanitize values.
        */

        realPower =
            Number.isFinite(realPower)
                ? realPower
                : fallbackState.realPower;


        powerFactor =
            Number.isFinite(powerFactor)
                ? Math.min(
                    Math.max(powerFactor, 0.01),
                    1
                )
                : fallbackState.powerFactor;


        /*
           If reactive/apparent power aren't available,
           calculate them.
        */

        if (
            !Number.isFinite(reactivePower) ||
            reactivePower <= 0
        ) {

            reactivePower =
                calculateReactivePower(
                    realPower,
                    powerFactor
                );
        }


        if (
            !Number.isFinite(apparentPower) ||
            apparentPower <= 0
        ) {

            apparentPower =
                calculateApparentPower(
                    realPower,
                    powerFactor
                );
        }


        /*
           Calculate compensation requirement.
        */

        const compensation =
            calculateRequiredCompensation(
                realPower,
                powerFactor
            );


        /*
           Classify system.
        */

        const load =
            classifyLoad(realPower);


        const pfStatus =
            classifyPowerFactor(powerFactor);


        const recommendation =
            generateRecommendation(
                powerFactor,
                compensation
            );


        /* --------------------------------------------------------
           UPDATE DOM
           -------------------------------------------------------- */

        const loadCondition =
            document.getElementById(
                "sheers-load-condition"
            );

        const loadDescription =
            document.getElementById(
                "sheers-load-description"
            );

        const pfAssessment =
            document.getElementById(
                "sheers-pf-assessment"
            );

        const pfValue =
            document.getElementById(
                "sheers-intelligence-pf"
            );

        const reactiveValue =
            document.getElementById(
                "sheers-reactive-demand"
            );

        const compensationValue =
            document.getElementById(
                "sheers-compensation-required"
            );

        const compensationDescription =
            document.getElementById(
                "sheers-compensation-description"
            );

        const recommendationValue =
            document.getElementById(
                "sheers-recommendation"
            );

        const recommendationDescription =
            document.getElementById(
                "sheers-recommendation-description"
            );

        const analysisMessage =
            document.getElementById(
                "sheers-analysis-message"
            );


        if (loadCondition) {
            loadCondition.textContent =
                load.title;
        }


        if (loadDescription) {
            loadDescription.textContent =
                load.description;
        }


        if (pfAssessment) {
            pfAssessment.textContent =
                pfStatus.title;
        }


        if (pfValue) {
            pfValue.textContent =
                powerFactor.toFixed(2);
        }


        if (reactiveValue) {
            reactiveValue.textContent =
                reactivePower.toFixed(1) +
                " kVAr";
        }


        if (compensationValue) {

            compensationValue.textContent =
                compensation.toFixed(1) +
                " kVAr";
        }


        if (compensationDescription) {

            if (compensation <= 0) {

                compensationDescription.textContent =
                    "No additional compensation required.";

            } else {

                compensationDescription.textContent =
                    "Estimated reactive compensation needed to reach PF 0.95.";
            }
        }


        if (recommendationValue) {

            recommendationValue.textContent =
                recommendation.title;
        }


        if (recommendationDescription) {

            recommendationDescription.textContent =
                recommendation.description;
        }


        if (analysisMessage) {

            analysisMessage.textContent =
                `Analyzing ${realPower.toFixed(1)} kW load · ` +
                `PF ${powerFactor.toFixed(2)} · ` +
                `${reactivePower.toFixed(1)} kVAr reactive demand`;
        }


        const status =
            document.getElementById(
                "sheers-analysis-status"
            );


        if (status) {

            if (powerFactor >= 0.90) {

                status.textContent =
                    "SYSTEM STABLE";

            } else if (powerFactor >= 0.65) {

                status.textContent =
                    "REACTIVE DEMAND";

            } else {

                status.textContent =
                    "CRITICAL CONDITION";
            }
        }
    }


    /* ------------------------------------------------------------
       INITIALIZE
       ------------------------------------------------------------ */

    function initializePhase21() {

        createIntelligencePanel();

        updateIntelligence();

        /*
           Continuously analyze the existing simulation.

           500 ms gives us a responsive dashboard without
           unnecessarily hammering the browser.
        */

        setInterval(
            updateIntelligence,
            500
        );
    }


    /*
       Wait until the page is ready.
    */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePhase21
        );

    } else {

        initializePhase21();
    }


})();