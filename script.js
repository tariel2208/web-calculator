const display = document.getElementById('display');
const expression = document.getElementById('expression');

let input = '';
let isResult = false;

function updateDisplay(val) {
    display.value = val || '';
}

function formatExpression(expr) {
    return expr.replace(/\*/g, '×').replace(/\//g, '÷');
}

function safeEval(expr) {
    if (!/^[0-9+\-*/.() ]+$/.test(expr)) {
        throw "Invalid";
    }
    return Function('"use strict"; return (' + expr + ')')();
}

document.getElementById('buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const val = btn.dataset.val;

    if (btn.id === 'clearBtn') {
        input = '';
        expression.textContent = '';
        updateDisplay('');
        display.classList.remove('error');
        return;
    }

    if (btn.id === 'equalsBtn') {
        if (!input) return;
        try {
            const calcResult = safeEval(input);
            if (!isFinite(calcResult)) throw "Math Error";
            expression.textContent = formatExpression(input) + ' =';
            const formatted = parseFloat(calcResult.toFixed(10)).toString();
            updateDisplay(formatted);
            input = formatted;
            isResult = true;
        } catch {
            display.classList.add('error');
            updateDisplay('Xəta');
            input = '';
            expression.textContent = '';
            setTimeout(() => {
                display.classList.remove('error');
                updateDisplay('');
            }, 1200);
        }
        return;
    }

    if (val !== undefined) {
        const isOperator = ['+', '-', '*', '/'].includes(val);

        if (input==='' && isOperator) return;

        if (isResult) {
            if (isOperator) {
                isResult = false;
            } else {
                input = '';
                expression.textContent = '';
                isResult = false;
            }
        }


        const lastchar = input.slice(-1);

        if (isOperator && ['+', '-', '*', '/'].includes(lastchar)) {
            input = input.slice(0, -1);
        }

        if (val === '.' && input.split(/[\+\-\*\/]/).pop().includes('.')) {
            return;
        }

        input += val;
        updateDisplay(formatExpression(input));
    }
});

document.addEventListener('keydown', (e) => {
    const key = e.key;

    if ('0123456789'.includes(key) || ['+', '-', '*', '/'].includes(key)) {
        document.querySelector(`[data-val="${key}"]`)?.click();
    } else if (key === '.') {
        document.querySelector(`[data-val="."]`)?.click();
    } else if (key === 'Enter' || key === '=') {
        document.getElementById('equalsBtn').click();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        document.getElementById('clearBtn').click();
    } else if (key === 'Backspace') {
        if (input) {
            input = input.slice(0, -1);
            updateDisplay(formatExpression(input));
        }
    }
});