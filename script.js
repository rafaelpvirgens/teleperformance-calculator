// Load html2pdf dynamically for PDF export feature
(function () {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    document.head.appendChild(script);
})();

function calculateSalary() {
    const employeeName = document.getElementById('employeeName').value;
    const monthSelect = document.getElementById('monthSelect');
    const monthName = monthSelect.options[monthSelect.selectedIndex].text;
    
    const baseSalary = parseFloat(document.getElementById('contractBaseSalary').value) || 0;
    const bonus = parseFloat(document.getElementById('bonus').value) || 0;
    const duodecimos = document.getElementById('duodecimosOpt').value;
    const workingDays = parseInt(document.getElementById('workingDays').value) || 22;
    const irsPercent = parseFloat(document.getElementById('irsPercent').value) || 0;

    const weekdayNights = parseInt(document.getElementById('weekdayNights').value) || 0;
    const fridayNights = parseInt(document.getElementById('fridayNights').value) || 0;
    const saturdayNights = parseInt(document.getElementById('saturdayNights').value) || 0;
    const sundayNights = parseInt(document.getElementById('sundayNights').value) || 0;

    const hourlyRate = baseSalary / 173;
    const nightBonusRate = hourlyRate * 0.25;
    const hoursPerNight = 8;
    
    const totalNights = weekdayNights + fridayNights + saturdayNights + sundayNights;
    const totalNightValue = totalNights * hoursPerNight * (hourlyRate + nightBonusRate);

    const mealAllowancePerDay = 7.63;
    const totalMealAllowance = workingDays * mealAllowancePerDay;

    const grossTotal = baseSalary + bonus + totalNightValue + totalMealAllowance;

    const socialSecurity = (baseSalary + bonus + totalNightValue) * 0.11;
    const irsDeduction = (baseSalary * (irsPercent / 100));

    const totalDeductions = socialSecurity + irsDeduction;
    const netSalary = grossTotal - totalDeductions;

    const outputText = `
Name:           ${employeeName}
Month:          ${monthName}
---------------------------------------------
[ EARNINGS ]
Base Salary:    € ${baseSalary.toFixed(2)}
Bonus:          € ${bonus.toFixed(2)}
Night Shifts:   € ${totalNightValue.toFixed(2)} (${totalNights} nights)
Meal Allowance: € ${totalMealAllowance.toFixed(2)} (${workingDays} days)
---------------------------------------------
GROSS TOTAL:    € ${grossTotal.toFixed(2)}

[ DEDUCTIONS ]
Social Security:€ ${socialSecurity.toFixed(2)}
IRS Tax (${irsPercent}%):  € ${irsDeduction.toFixed(2)}
---------------------------------------------
TOTAL DEDUCT:   € ${totalDeductions.toFixed(2)}
=============================================
NET SALARY:     € ${netSalary.toFixed(2)}
=============================================
Duodecimos:     ${duodecimos}
`;

    const resultSection = document.getElementById('resultSection');
    const outputContent = document.getElementById('outputContent');
    
    outputContent.innerText = outputText;
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function clearForm() {
    if(!confirm("Are you sure you want to clear all fields?")) return;

    document.getElementById('employeeName').value = "Rafael Virgens";
    document.getElementById('contractBaseSalary').value = "938";
    document.getElementById('bonus').value = "0";
    document.getElementById('workingDays').value = "22";
    document.getElementById('irsPercent').value = "0";
    
    document.getElementById('weekdayNights').value = "0";
    document.getElementById('fridayNights').value = "0";
    document.getElementById('saturdayNights').value = "0";
    document.getElementById('sundayNights').value = "0";

    document.getElementById('resultSection').classList.add('hidden');
}

function exportToPdf() {
    const element = document.getElementById('outputContent');
    
    if(document.getElementById('resultSection').classList.contains('hidden')) {
        alert("Please calculate the payslip first before exporting.");
        return;
    }

    const opt = {
        margin: 10,
        filename: `Payslip_${document.getElementById('employeeName').value}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const pdfHeader = document.createElement('div');
    pdfHeader.innerHTML = `
        <div style="text-align:center; margin-bottom: 20px; font-family: sans-serif;">
            <img src="mylogo.jpg" style="height:35px; margin: 0 auto; object-fit: contain;">
            <h2>OFFICIAL PAYSLIP SIMULATION</h2>
        </div>
    `;
    element.prepend(pdfHeader);

    html2pdf().set(opt).from(element).save().then(() => {
        pdfHeader.remove();
    });
}