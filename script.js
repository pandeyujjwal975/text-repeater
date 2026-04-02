/**
 * TEXT REPEATER ULTRA - CORE LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text');
    const countInput = document.getElementById('count');
    const resultArea = document.getElementById('result');
    const toggles = document.querySelectorAll('.toggle');

    // --- 1. Handle Custom Toggles ---
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            
            // Toggle Accessibility State
            const isActive = toggle.classList.contains('active');
            toggle.setAttribute('aria-checked', isActive);
            
            // Optional: Auto-generate on toggle change
            if (textInput.value) repeatText();
        });
    });

    // --- 2. Main Repeat Function ---
    window.repeatText = () => {
        const text = textInput.value;
        const count = parseInt(countInput.value);
        const addSpace = document.getElementById('spaceToggle').classList.contains('active');
        const addNewline = document.getElementById('newlineToggle').classList.contains('active');

        // Validation
        if (!text) {
            showToast("Enter some text first!", "error");
            return;
        }
        if (isNaN(count) || count <= 0) {
            showToast("Enter a valid number!", "error");
            return;
        }

        // Define Separator
        let separator = "";
        if (addSpace) separator += " ";
        if (addNewline) separator += "\n";

        // Efficient Logic: Using Array join is faster for large repetitions
        const repeatedContent = new Array(count).fill(text).join(separator);
        
        resultArea.value = repeatedContent;

        // Visual Feedback for "Run"
        const runBtn = document.querySelector('.run');
        runBtn.style.transform = "scale(0.95)";
        setTimeout(() => runBtn.style.transform = "scale(1.02)", 100);
    };

    // --- 3. Copy Functionality ---
    window.copyText = async () => {
        if (!resultArea.value) {
            showToast("Nothing to copy!", "error");
            return;
        }

        try {
            await navigator.clipboard.writeText(resultArea.value);
            
            // Premium Feedback
            const copyBtn = document.querySelector('.copy');
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.style.background = "rgba(34, 197, 94, 0.2)";
            
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
                copyBtn.style.background = "";
            }, 2000);
            
            showToast("Copied to clipboard!");
        } catch (err) {
            showToast("Failed to copy", "error");
        }
    };

    // --- 4. WhatsApp Sharing ---
    window.shareWhatsApp = () => {
        const content = resultArea.value;
        if (!content) {
            showToast("Generate text first!", "error");
            return;
        }

        const encodedText = encodeURIComponent(content);
        window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
    };

    // --- 5. Helper: Simple Toast Feedback ---
    function showToast(message, type = "success") {
        // We'll use the placeholder of the result area as a temporary notification
        const originalPlaceholder = resultArea.placeholder;
        resultArea.placeholder = `[ ${message.toUpperCase()} ]`;
        
        setTimeout(() => {
            resultArea.placeholder = originalPlaceholder;
        }, 2000);
    }
    
    // Allow "Enter" key on count input to trigger the run
    countInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') repeatText();
    });
});
