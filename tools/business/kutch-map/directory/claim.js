/**
 * directory/claim.js
 * Layer 2 — Claiming Flow for Kutch Digital Map
 */

window._VD_CLAIM = (() => {
    let currentDocId = null;
    let currentStep = 1;

    // --- INJECT MODAL ---

    function injectModal() {
        if (document.getElementById('vd-claim-modal')) return;

        const modalCont = document.createElement('div');
        modalCont.id = 'vd-claim-modal';
        modalCont.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);
            z-index: 2000; display: none; align-items: flex-end; justify-content: center;
        `;

        modalCont.innerHTML = `
            <div id="vd-claim-sheet" style="
                width: 100%; max-width: 500px; background: var(--surface); 
                border-top-left-radius: 24px; border-top-right-radius: 24px;
                padding: 40px; box-shadow: 0 -20px 40px rgba(0,0,0,0.5);
                transform: translateY(100%); transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                position: relative;">
                
                <button onclick="_VD_CLAIM.close()" style="
                    position: absolute; top: 20px; right: 20px; background: none; border: none; 
                    color: var(--muted); font-size: 24px; cursor: pointer;">✕</button>

                <!-- STEP 1: AUTH -->
                <div id="vd-claim-step-1" class="claim-step">
                    <h2 style="font-family: serif; font-size: 28px; margin-bottom: 12px;">Sign in to Claim</h2>
                    <p style="color: var(--muted); margin-bottom: 30px;">To verify you own this business, please sign in with your Google account.</p>
                    <button onclick="_VD_AUTH.login()" style="width: 100%; padding: 15px; background: #fff; color: #000; border: none; font-weight: 700; border-radius: 4px; cursor: pointer;">Sign in with Google</button>
                    <p style="text-align: center; color: var(--muted); font-size: 11px; margin-top: 15px;">Secure OAuth verification via via-decide.</p>
                </div>

                <!-- STEP 2: CONFIRM IDENTITY -->
                <div id="vd-claim-step-2" class="claim-step" style="display: none;">
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                        <img id="vd-claim-user-avatar" src="" style="width: 48px; height: 48px; border-radius: 50%; background: var(--border);">
                        <div>
                            <div id="vd-claim-user-name" style="font-weight: 600; font-size: 16px;">User Name</div>
                            <div id="vd-claim-user-email" style="font-size: 12px; color: var(--muted);">email@gmail.com</div>
                        </div>
                    </div>
                    <div style="padding: 20px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; margin-bottom: 25px;">
                        <div style="font-size: 11px; color: var(--accent); font-family: var(--mono); text-transform: uppercase;">YOU ARE CLAIMING:</div>
                    <h3 id="vd-claim-biz-name" style="font-family: serif; font-size: 22px; margin-bottom: 15px;">Business Name</h3>
                    <p style="font-size: 13px; color: var(--muted);">WARNING: ONLY CLAIM BUSINESSES YOU OWN OR MANAGE. False claims result in permanent suspension.</p>
                    </div>
                    <button onclick="_VD_CLAIM.nextStep()" style="width: 100%; padding: 15px; background: var(--accent); color: #000; border: none; font-weight: 700; border-radius: 4px; cursor: pointer;">Confirm & Continue →</button>
                </div>

                <!-- STEP 3: VERIFICATION FORM -->
                <div id="vd-claim-step-3" class="claim-step" style="display: none;">
                    <h2 style="font-family: serif; font-size: 24px; margin-bottom: 15px;">Verification Details</h2>
                    <div class="form-scroll" style="max-height: 400px; overflow-y: auto; padding-right: 5px;">
                        <label>Your Name (Owner/Manager)</label>
                        <input type="text" id="vd-claim-form-name" placeholder="Full Name">
                        
                        <label>WhatsApp Number (+91)</label>
                        <input type="text" id="vd-claim-form-whatsapp" placeholder="10 Digits">
                        
                        <label>ONDC Status (Optional)</label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                            <input type="checkbox" id="vd-claim-ondc-check" style="width: auto; margin:0;">
                            <span style="font-weight: 700; color: #FF6B00;">⚡ We are on ONDC network</span>
                        </label>
                            
                        <div id="vd-claim-ondc-reveal" style="display: none; margin-top: 15px; padding-left: 10px;">
                            <label>ONDC Catalogue URL</label>
                            <input type="url" id="vd-claim-ondc-url" placeholder="https://seller.mystore.in/ondc/...">
                        </div>
                    </div>
                    <button onclick="_VD_CLAIM.submit()" id="vd-claim-submit-btn" style="width: 100%; margin-top: 20px; padding: 15px; background: #4ade80; color: #000; border: none; font-weight: 700; border-radius: 4px; cursor: pointer;">Verify & Publish →</button>
                </div>

                <!-- STEP 4: SUCCESS -->
                <div id="vd-claim-step-4" class="claim-step" style="display: none; text-align: center; padding: 40px 0;">
                    <div style="font-size: 60px; margin-bottom: 20px;">✓</div>
                    <h2 style="font-family: serif; font-size: 28px; margin-bottom: 12px;">Verified!</h2>
                    <p id="vd-claim-success-msg" style="color: var(--muted); margin-bottom: 30px;">Listing is now verified on the Kutch Digital Map.</p>
                </div>

                <style>
                    .claim-step label { display: block; font-size: 11px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; margin-top: 15px; font-family: var(--mono); }
                    .claim-step input[type="text"], .claim-step input[type="url"] { 
                        width: 100%; padding: 12px; background: var(--surface2); border: 1px solid var(--border); color: #fff; border-radius: 4px; font-family: inherit;
                    }
                </style>
            </div>
        `;

        document.body.appendChild(modalCont);

        const ondcCheck = document.getElementById('vd-claim-ondc-check');
        const ondcReveal = document.getElementById('vd-claim-ondc-reveal');
        if (ondcCheck && ondcReveal) {
            ondcCheck.addEventListener('change', (e) => ondcReveal.style.display = e.target.checked ? 'block' : 'none');
        }

        _VD_AUTH.onReady((user) => {
            if (user && currentDocId && currentStep === 1) {
                showStep(2);
            }
        });
    }

    function showStep(s) {
        currentStep = s;
        document.querySelectorAll('.claim-step').forEach(el => el.style.display = 'none');
        const target = document.getElementById(`vd-claim-step-${s}`);
        if (target) {
            target.style.display = 'block';
            if (s === 2) {
                const user = _VD_AUTH.getUser();
                document.getElementById('vd-claim-user-avatar').src = user.photoURL;
                document.getElementById('vd-claim-user-name').innerText = user.displayName;
                document.getElementById('vd-claim-user-email').innerText = user.email;
                document.getElementById('vd-claim-form-name').value = user.displayName;
            }
        }
    }

    return {
        open: (docId) => {
            currentDocId = docId;
            injectModal();
            const modal = document.getElementById('vd-claim-modal');
            const sheet = document.getElementById('vd-claim-sheet');
            modal.style.display = 'flex';
            setTimeout(() => sheet.style.transform = 'translateY(0)', 10);
            
            const biz = document.querySelector(`.claim-cta-btn[onclick*="${docId}"]`)?.closest('.dir-card').querySelector('.dir-card-name')?.innerText || 'Business';
            document.getElementById('vd-claim-biz-name').innerText = biz;

            if (_VD_AUTH.getUser()) showStep(2);
            else showStep(1);
        },
        close: () => {
            const sheet = document.getElementById('vd-claim-sheet');
            sheet.style.transform = 'translateY(100%)';
            setTimeout(() => {
                document.getElementById('vd-claim-modal').style.display = 'none';
            }, 400);
        },
        nextStep: () => showStep(3),
        submit: async () => {
            const btn = document.getElementById('vd-claim-submit-btn');
            btn.disabled = true;
            btn.innerText = "Claiming...";

            const user = _VD_AUTH.getUser();
            const payload = {
                claimed: true,
                claimedBy: user.uid,
                verified: true,
                ownerName: document.getElementById('vd-claim-form-name').value,
                whatsapp: document.getElementById('vd-claim-form-whatsapp').value,
                ondc: document.getElementById('vd-claim-ondc-check').checked,
                ondcCatalogueURL: document.getElementById('vd-claim-ondc-url').value
            };

            try {
                const db = firebase.firestore();
                await db.collection('businesses').doc(currentDocId).update(payload);
                showStep(4);
                setTimeout(() => window.location.reload(), 2000);
            } catch (err) {
                console.error(err);
                alert("Permission Denied: Business may already be claimed.");
                btn.disabled = false;
                btn.innerText = "Verify & Publish →";
            }
        }
    };
})();
