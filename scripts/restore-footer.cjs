const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

const target = `                                            </svg>
                                        </div>
        );`;

const targetCRLF = `                                            </svg>\r\n                                        </div>\r\n        );`;

const replacement = `                                            </svg>
                                        </div>
                                        <div>Instagram</div>
                                    </a>
                                    <a href="https://www.youtube.com/channel/UCA1C9H8oWZomVPiV2GjEOaQ" target="_blank"
                                        rel="noopener noreferrer" class="footer-menu_link w-inline-block">
                                        <div class="footer-social_icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 16 16"
                                                fill="none" vector-effect="non-scaling-stroke"
                                                preserveAspectRatio="none">
                                                <path
                                                    d="M15.8 4.6C15.6 3.9 15.1 3.3 14.4 3.1 13.1 2.8 8 2.8 8 2.8s-5.1 0-6.4.3C.9 3.3.4 3.9.2 4.6 0 5.9 0 8 0 8s0 2.1.2 3.4c.2.7.7 1.3 1.4 1.5 1.3.3 6.4.3 6.4.3s5.1 0 6.4-.3c.7-.2 1.2-.8 1.4-1.5.2-1.3.2-3.4.2-3.4s0-2.1-.2-3.4zM6.4 10.4V5.6l4.2 2.4-4.2 2.4z"
                                                    fill="currentColor"></path>
                                            </svg>
                                        </div>
                                        <div>YouTube</div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div data-w-id="c179c474-dbf0-a107-6eba-5d7b4af74d6f" class="footer_bottom">
                <div class="footer-bottom_element">
                    <div class="text-color-dark">
                        &copy; 2026 Redesign Dental Clinics. All rights reserved.
                    </div>
                    <div class="footer-bottom_right">
                        <a href="/terms" class="footer-menu_link w-inline-block">
                            <div data-i18n="nav.terms">Terms & Conditions</div>
                        </a>
                        <div class="footer-bottom_right-divider"></div>
                        <a href="/privacy" class="footer-menu_link w-inline-block">
                            <div data-i18n="nav.privacy">Privacy Policy</div>
                        </a>
                    </div>
                </div>
            </div>
    </div>
    </div>
    </footer>
    </div>
    <script src="assets/js/jquery-3.5.1.min.js" type="text/javascript"></script>
    <script src="assets/js/webflow.schunk.36b8fb49256177c8.js" type="text/javascript"></script>
    <script src="assets/js/webflow.schunk.5e71080783712679.js" type="text/javascript"></script>
    <script src="assets/js/webflow.c9187143.3b5f57f78ed8e3cc.js" type="text/javascript"></script>
    <script src="assets/js/gsap.min.js" type="text/javascript"></script>
    <script src="assets/js/SplitText.min.js" type="text/javascript"></script>
    <script src="assets/js/ScrollTrigger.min.js" type="text/javascript"></script>
    <script>

        gsap.registerPlugin(ScrollTrigger);

        document.addEventListener("DOMContentLoaded", () => {

            initCounterAnimations();
        }
        );`;

let newContent = null;
if (content.includes(targetCRLF)) {
    console.log('Matched target with CRLF');
    newContent = content.replace(targetCRLF, replacement.replace(/\n/g, '\r\n'));
} else if (content.includes(target)) {
    console.log('Matched target with LF');
    newContent = content.replace(target, replacement);
} else {
    console.error('Target not found in index.html');
    process.exit(1);
}

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully restored footer and scripts in index.html');
