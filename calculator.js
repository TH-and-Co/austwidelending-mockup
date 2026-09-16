/**
 * Central Mortgage Configuration
 * The client can edit these benchmark rate constants directly here:
 */
export const DEFAULT_VARIABLE_RATE = 0.0614; // 6.14% p.a. standard variable benchmark
export const IO_VARIABLE_RATE = 0.0644;      // 6.44% p.a. interest-only benchmark

class MortgageCalculator {
  constructor() {
    // Default configuration
    this.propertyValue = 750000;
    this.depositAmount = 150000;
    this.loanTermYears = 30;
    this.annualRate = +(DEFAULT_VARIABLE_RATE * 100).toFixed(2);
    this.repaymentType = 'pi'; // 'pi' (principal & interest) or 'io' (interest only)
    this.frequency = 'monthly'; // 'monthly', 'fortnightly', 'weekly'
    
    // DOM Elements
    this.elements = {
      propertyInput: document.getElementById('propertyValueInput'),
      propertySlider: document.getElementById('propertyValueSlider'),
      depositInput: document.getElementById('depositInput'),
      depositHint: document.getElementById('depositHint'),
      depositPills: document.querySelectorAll('.deposit-pill'),
      loanTermSelect: document.getElementById('loanTermSelect'),
      repaymentTypeSelect: document.getElementById('repaymentTypeSelect'),
      freqButtons: document.querySelectorAll('.freq-btn'),
      repaymentAmount: document.getElementById('repaymentAmount'),
      repaymentPeriod: document.getElementById('repaymentPeriod'),
      breakdownLoanAmount: document.getElementById('breakdownLoanAmount'),
      breakdownTerm: document.getElementById('breakdownTerm'),
      breakdownLvr: document.getElementById('breakdownLvr'),
      breakdownRate: document.getElementById('breakdownRate')
    };

    this.currentDisplayedValue = 0;
    this.init();
  }

  init() {
    if (!this.elements.propertyInput) return;

    this.bindEvents();
    this.updateCalculator(true);
  }

  formatCurrency(val) {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      maximumFractionDigits: 0
    }).format(val);
  }

  formatNumber(val) {
    return new Intl.NumberFormat('en-AU', {
      maximumFractionDigits: 0
    }).format(Math.round(val));
  }

  parseCurrency(str) {
    if (typeof str === 'number') return str;
    const cleanStr = String(str).replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
  }

  bindEvents() {
    // Property value input
    const onPropertyChange = (val) => {
      if (val > 10000000) val = 10000000;
      this.propertyValue = val;
      if (this.elements.propertySlider) {
        this.elements.propertySlider.value = Math.min(Math.max(val, 100000), 2500000);
      }
      this.syncDepositPercentage();
      this.updateCalculator();
    };

    this.elements.propertyInput.addEventListener('input', (e) => {
      onPropertyChange(this.parseCurrency(e.target.value));
    });

    this.elements.propertyInput.addEventListener('change', (e) => {
      onPropertyChange(this.parseCurrency(e.target.value));
    });

    this.elements.propertyInput.addEventListener('blur', (e) => {
      e.target.value = this.formatNumber(this.propertyValue);
    });

    // Property slider
    if (this.elements.propertySlider) {
      const onSliderChange = (e) => {
        this.propertyValue = parseFloat(e.target.value);
        this.elements.propertyInput.value = this.formatNumber(this.propertyValue);
        this.syncDepositPercentage();
        this.updateCalculator();
      };
      this.elements.propertySlider.addEventListener('input', onSliderChange);
      this.elements.propertySlider.addEventListener('change', onSliderChange);
    }

    // Deposit input
    const onDepositChange = (val) => {
      if (val > this.propertyValue) val = this.propertyValue;
      this.depositAmount = val;
      this.clearActiveDepositPills();
      this.updateCalculator();
    };

    this.elements.depositInput.addEventListener('input', (e) => {
      onDepositChange(this.parseCurrency(e.target.value));
    });

    this.elements.depositInput.addEventListener('change', (e) => {
      onDepositChange(this.parseCurrency(e.target.value));
    });

    this.elements.depositInput.addEventListener('blur', (e) => {
      e.target.value = this.formatNumber(this.depositAmount);
    });

    // Deposit quick pills
    this.elements.depositPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const percent = parseFloat(pill.dataset.percent);
        this.depositAmount = Math.round((this.propertyValue * percent) / 100);
        this.elements.depositInput.value = this.formatNumber(this.depositAmount);
        
        this.elements.depositPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        this.updateCalculator();
      });
    });

    // Loan term select - bind both change and input
    const onTermChange = (e) => {
      this.loanTermYears = parseInt(e.target.value, 10);
      this.updateCalculator();
    };
    this.elements.loanTermSelect.addEventListener('change', onTermChange);
    this.elements.loanTermSelect.addEventListener('input', onTermChange);

    // Repayment type select - bind both change and input
    if (this.elements.repaymentTypeSelect) {
      const onTypeChange = (e) => {
        this.repaymentType = e.target.value;
        this.updateCalculator();
      };
      this.elements.repaymentTypeSelect.addEventListener('change', onTypeChange);
      this.elements.repaymentTypeSelect.addEventListener('input', onTypeChange);
    }

    // Frequency switcher
    this.elements.freqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.elements.freqButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.frequency = btn.dataset.freq;
        this.updateCalculator();
      });
    });
  }

  syncDepositPercentage() {
    const activePill = document.querySelector('.deposit-pill.active');
    if (activePill) {
      const percent = parseFloat(activePill.dataset.percent);
      this.depositAmount = Math.round((this.propertyValue * percent) / 100);
      this.elements.depositInput.value = this.formatNumber(this.depositAmount);
    }
  }

  clearActiveDepositPills() {
    const currentPercent = Math.round((this.depositAmount / (this.propertyValue || 1)) * 100);
    this.elements.depositPills.forEach(p => {
      if (parseInt(p.dataset.percent, 10) === currentPercent) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  calculateMonthlyRepayment(loanAmount, annualRatePercent, termYears, isInterestOnly) {
    if (loanAmount <= 0) return 0;
    const monthlyRate = (annualRatePercent / 100) / 12;
    
    if (isInterestOnly) {
      return loanAmount * monthlyRate;
    }
    
    const numPayments = termYears * 12;
    const factor = Math.pow(1 + monthlyRate, numPayments);
    const monthlyPayment = (loanAmount * (monthlyRate * factor)) / (factor - 1);
    
    return monthlyPayment;
  }

  animateNumber(targetVal) {
    const duration = 280;
    const startVal = this.currentDisplayedValue || targetVal;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (targetVal - startVal) * easeOut);
      
      this.elements.repaymentAmount.textContent = `$${current.toLocaleString('en-AU')}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.currentDisplayedValue = targetVal;
        this.elements.repaymentAmount.textContent = `$${targetVal.toLocaleString('en-AU')}`;
      }
    };

    requestAnimationFrame(step);
  }

  convertMonthlyToFrequency(monthlyAmount, freq) {
    if (freq === 'fortnightly') {
      return (monthlyAmount * 12) / 26;
    } else if (freq === 'weekly') {
      return (monthlyAmount * 12) / 52;
    }
    return monthlyAmount;
  }

  updateCalculator(isInitial = false) {
    const loanAmount = Math.max(0, this.propertyValue - this.depositAmount);
    const isIO = this.repaymentType === 'io';
    
    // Benchmark rates in Australia: configured centrally via DEFAULT_VARIABLE_RATE
    this.annualRate = isIO ? +(IO_VARIABLE_RATE * 100).toFixed(2) : +(DEFAULT_VARIABLE_RATE * 100).toFixed(2);
    
    // Standard Australian Interest-Only period is 5 years
    const ioPeriodYears = 5;
    const remainingTermYears = Math.max(5, this.loanTermYears - ioPeriodYears);
    
    // Calculate current period repayment
    const monthlyRepayment = this.calculateMonthlyRepayment(loanAmount, this.annualRate, this.loanTermYears, isIO);
    
    // Calculate post-IO reversion repayment (over remaining term using standard variable rate)
    const revertMonthlyRepayment = this.calculateMonthlyRepayment(loanAmount, +(DEFAULT_VARIABLE_RATE * 100).toFixed(2), remainingTermYears, false);

    // Calculate frequency amount
    const finalAmount = this.convertMonthlyToFrequency(monthlyRepayment, this.frequency);
    const revertFrequencyAmount = this.convertMonthlyToFrequency(revertMonthlyRepayment, this.frequency);
    
    let periodText = '/mo';
    let freqShort = 'mo';
    if (this.frequency === 'fortnightly') {
      periodText = '/fn';
      freqShort = 'fn';
    } else if (this.frequency === 'weekly') {
      periodText = '/wk';
      freqShort = 'wk';
    }

    const roundedAmount = Math.round(finalAmount);
    const roundedRevertAmount = Math.round(revertFrequencyAmount);

    if (isInitial) {
      this.currentDisplayedValue = roundedAmount;
      this.elements.repaymentAmount.textContent = `$${roundedAmount.toLocaleString('en-AU')}`;
      if (this.elements.propertyInput) this.elements.propertyInput.value = this.formatNumber(this.propertyValue);
      if (this.elements.depositInput) this.elements.depositInput.value = this.formatNumber(this.depositAmount);
    } else {
      this.animateNumber(roundedAmount);
    }

    this.elements.repaymentPeriod.textContent = periodText;

    // LVR calculations
    const lvr = this.propertyValue > 0 ? Math.round((loanAmount / this.propertyValue) * 100) : 0;
    const depositPercent = 100 - lvr;

    // Update deposit hint
    if (this.elements.depositHint) {
      if (lvr > 80) {
        this.elements.depositHint.innerHTML = `<span style="color:#D97706;">${depositPercent}% Deposit (LMI may apply)</span>`;
      } else {
        this.elements.depositHint.innerHTML = `<span style="color:#059669;">✓ ${depositPercent}% Deposit (No LMI)</span>`;
      }
    }

    // Dynamic IO Reversion Banner / Note
    let ioNoteEl = document.getElementById('ioRevertNote');
    if (!ioNoteEl && this.elements.repaymentAmount.parentElement.parentElement) {
      ioNoteEl = document.createElement('div');
      ioNoteEl.id = 'ioRevertNote';
      ioNoteEl.className = 'io-revert-note';
      this.elements.repaymentAmount.parentElement.parentElement.appendChild(ioNoteEl);
    }

    if (ioNoteEl) {
      if (isIO) {
        ioNoteEl.style.display = 'block';
        ioNoteEl.innerHTML = `
          <div style="background:#FEF3C7; border:1px solid #FDE68A; border-radius:8px; padding:8px 12px; margin-top:10px; font-size:0.75rem; color:#92400E; text-align:left; line-height:1.4;">
            <strong>5-Year Interest-Only Period:</strong> Initial repayments cover interest only.<br>
            Then reverts to <strong>$${roundedRevertAmount.toLocaleString('en-AU')}/${freqShort}</strong> P&amp;I for the remaining <strong>${remainingTermYears} years</strong> of your ${this.loanTermYears}-year term.
          </div>
        `;
      } else {
        ioNoteEl.style.display = 'none';
      }
    }

    // Update breakdown specs
    if (this.elements.breakdownLoanAmount) {
      this.elements.breakdownLoanAmount.textContent = `$${loanAmount.toLocaleString('en-AU')}`;
    }
    if (this.elements.breakdownTerm) {
      this.elements.breakdownTerm.textContent = `${this.loanTermYears} Yrs`;
    }
    if (this.elements.breakdownLvr) {
      this.elements.breakdownLvr.textContent = `${lvr}%`;
    }
    if (this.elements.breakdownRate) {
      this.elements.breakdownRate.textContent = `${(this.annualRate).toFixed(2)}% p.a.*`;
    }

    // Update rate badge
    const rateBadgeEl = document.getElementById('rateBadgeText') || document.querySelector('.calc-rate-badge span:last-child');
    if (rateBadgeEl) {
      rateBadgeEl.textContent = `Est. Rate: ${(this.annualRate).toFixed(2)}% p.a.*`;
    }
  }
}

// Global instantiation helper
window.addEventListener('DOMContentLoaded', () => {
  window.mortgageCalculator = new MortgageCalculator();
});
