document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnCalculate').addEventListener('click', calculateSalary);
    document.getElementById('btnClear').addEventListener('click', clearFields);
    document.getElementById('btnExportPDF').addEventListener('click', exportToPDF);
});

function calculateSalary() {
    try {
        const monthName = document.getElementById('month').value;
        const contractBaseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
        const bonus = parseFloat(document.getElementById('bonus').value) || 0;
        const duodecimosOpt = document.getElementById('duodecimos').value;
        const shift = document.getElementById('shift').value;
        
        const workingDays = parseInt(document.getElementById('workingDays').value) || 22;
        const weekdayNights = parseInt(document.getElementById('monThuNights').value) || 0;
        const fridayNights = parseInt(document.getElementById('friNights').value) || 0;
        const saturdayNights = parseInt(document.getElementById('satNights').value) || 0;
        const sundayNights = parseInt(document.getElementById('sunNights').value) || 0;
        const irsPercent = parseFloat(document.getElementById('irsPercent').value) || 0.0;

        const nightShiftDays = weekdayNights + fridayNights + saturdayNights + sundayNights;
        const totalWeekendNights = saturdayNights + sundayNights;

        // Proportional Base Salary Calculation
        const standardWorkingDays = 22;
        const baseDailyRate = contractBaseSalary / standardWorkingDays;
        const effectiveBaseSalary = baseDailyRate * workingDays;

        // Hourly Rate (VR) Calculation
        const weeklyHours = 40.0;
        const vr = (contractBaseSalary * 12.0) / (52.0 * weeklyHours);

        // Duodecimos Calculation
        let holidayAllowanceDuodecimo = 0.0;
        let christmasAllowanceDuodecimo = 0.0;
        if (duodecimosOpt === "YES") {
            holidayAllowanceDuodecimo = contractBaseSalary / 12.0;
            christmasAllowanceDuodecimo = contractBaseSalary / 12.0;
        }
        const totalDuodecimos = holidayAllowanceDuodecimo + christmasAllowanceDuodecimo;

        // Night Shift Allowance Calculation
        const rate29 = vr * 0.29;
        const rate58 = vr * 0.58;

        let h29w = 0, h58w = 0;
        let h29f = 0, h58f = 0;
        let h29sat = 0, h58sat = 0;
        let h29sun = 0, h58sun = 0;
        let shiftDesc = "";

        if (shift === "1") {
            shiftDesc = "21:00 to 06:00";
            h29w = 2.0; h58w = 6.0;
            h29f = 2.0; h58f = 6.0;
            h29sat = 3.0; h58sat = 6.0;
            h29sun = 3.0; h58sun = 6.0;
        } else if (shift === "2") {
            shiftDesc = "23:00 to 08:00";
            h29w = 1.0; h58w = 7.0;
            h29f = 2.0; h58f = 7.0;
            h29sat = 2.0; h58sat = 7.0;
            h29sun = 1.0; h58sun = 7.0;
        } else if (shift === "3") {
            shiftDesc = "15:00 to 00:00";
            h29w = 2.0; h58w = 0.0;
            h29f = 2.0; h58f = 0.0;
            h29sat = 8.0; h58sat = 0.0;
            h29sun = 8.0; h58sun = 0.0;
        }

        const totalHours29 = (h29w * weekdayNights) + (h29f * fridayNights) + (h29sat * saturdayNights) + (h29sun * sundayNights);
        const totalHours58 = (h58w * weekdayNights) + (h58f * fridayNights) + (h58sat * saturdayNights) + (h58sun * sundayNights);

        const total29Month = totalHours29 * rate29;
        const total58Month = totalHours58 * rate58;
        const nightShiftTotal = total29Month + total58Month;

        // Meal Allowance
        const dailyMealAllowance = 7.00;
        const totalMealAllowance = dailyMealAllowance * workingDays;

        // Taxable Earnings Base
        const taxableBase = effectiveBaseSalary + nightShiftTotal + bonus + totalDuodecimos;

        // Detailed Deductions
        const ssBaseEarnings = effectiveBaseSalary + nightShiftTotal + bonus;
        const socialSecurityBase = ssBaseEarnings * 0.11;
        const ssHolidayDuodecimo = holidayAllowanceDuodecimo * 0.11;
        const ssChristmasDuodecimo = christmasAllowanceDuodecimo * 0.11;
        const totalSocialSecurity = socialSecurityBase + ssHolidayDuodecimo + ssChristmasDuodecimo;

        const irsDeduction = taxableBase * (irsPercent / 100.0);
        const totalDeductions = irsDeduction + totalSocialSecurity;

        // Totals and Net Salaries
        const totalEarnings = taxableBase + totalMealAllowance;
        const netBankSalary = taxableBase - totalDeductions;
        const totalNetGeneral = netBankSalary + totalMealAllowance;

        // Output Formatting
        let sb = "";
        sb += "====================================================================\n";
        sb += `      SALARY STATEMENT / PAYSLIP - ${monthName.toUpperCase()} 2026\n`;
        sb += "      Teleperformance Portugal | Google Project\n";
        sb += "      Created by Rafael Virgens\n";
        sb += "====================================================================\n\n";

        sb += "[ EARNINGS / ABONOS ]\n";
        if (workingDays === standardWorkingDays) {
            sb += `  • Base Salary (${workingDays} working days - Standard Full): EUR ${effectiveBaseSalary.toFixed(2)} (EUR ${baseDailyRate.toFixed(2)}/day)\n`;
        } else if (workingDays < standardWorkingDays) {
            sb += `  • Base Salary (${workingDays} working days - Proportional): EUR ${effectiveBaseSalary.toFixed(2)} (EUR ${baseDailyRate.toFixed(2)}/day)\n`;
        } else {
            let extraDays = workingDays - standardWorkingDays;
            sb += `  • Base Salary (${workingDays} working days - Includes ${extraDays} extra day(s) worked): EUR ${effectiveBaseSalary.toFixed(2)} (EUR ${baseDailyRate.toFixed(2)}/day)\n`;
        }

        sb += `  • Night Shift Allowance (${nightShiftDays} total nights: ${weekdayNights} Mon-Thu, ${fridayNights} Fri, ${saturdayNights} Sat, ${sundayNights} Sun):\n`;
        sb += `      - Shift Option: ${shiftDesc} | Weekend Nights Worked: ${totalWeekendNights}\n`;
        sb += `      - 29% Bracket Total: EUR ${total29Month.toFixed(2)} (${totalHours29.toFixed(1)} hours total @ EUR ${rate29.toFixed(4)}/h)\n`;
        sb += `      - 58% Bracket Total: EUR ${total58Month.toFixed(2)} (${totalHours58.toFixed(1)} hours total @ EUR ${rate58.toFixed(4)}/h)\n`;
        sb += `  • Productivity Bonus: EUR ${bonus.toFixed(2)}\n`;

        if (duodecimosOpt === "YES") {
            sb += `  • Holiday Allowance (Duodecimo): EUR ${holidayAllowanceDuodecimo.toFixed(2)}\n`;
            sb += `  • Christmas Allowance (Duodecimo): EUR ${christmasAllowanceDuodecimo.toFixed(2)}\n`;
        } else {
            sb += "  • Duodecimos (Holiday/Christmas): Not applicable (paid in standard months)\n";
        }

        sb += `  • Meal Allowance TAX FREE (Cover FLEX Card): EUR ${totalMealAllowance.toFixed(2)} (${workingDays} working days × EUR ${dailyMealAllowance.toFixed(2)})\n`;

        sb += "\n[ DEDUCTIONS / DESCONTOS ]\n";
        sb += `  • IRS Withholding Tax (${irsPercent}%): EUR ${irsDeduction.toFixed(2)}\n`;
        sb += `  • Social Security (Base/Bonus/Night Shift) (11%): EUR ${socialSecurityBase.toFixed(2)}\n`;
        sb += `  • Social Security (Holiday Allowance) (11%): EUR ${ssHolidayDuodecimo.toFixed(2)}\n`;
        sb += `  • Social Security (Christmas Allowance) (11%): EUR ${ssChristmasDuodecimo.toFixed(2)}\n`;

        sb += "\n--------------------------------------------------------------------\n";
        sb += `  > TOTAL TAXABLE GROSS: EUR ${taxableBase.toFixed(2)}\n`;
        sb += `  > TOTAL EARNINGS (ABONOS TOTAL): EUR ${totalEarnings.toFixed(2)}\n`;
        sb += `  > TOTAL DEDUCTIONS (DESCONTOS TOTAL): EUR ${totalDeductions.toFixed(2)}\n`;
        sb += "--------------------------------------------------------------------\n";
        sb += `  💳 MEAL ALLOWANCE TAX FREE (Cover FLEX Card): EUR ${totalMealAllowance.toFixed(2)}\n`;
        sb += `  💰 REMAINING NET SALARY (Bank Transfer Net): EUR ${netBankSalary.toFixed(2)}\n`;
        sb += `  🌟 TOTAL GENERAL NET (Bank + Cover FLEX): EUR ${totalNetGeneral.toFixed(2)}\n`;
        sb += "====================================================================\n";

        document.getElementById('output').textContent = sb;

    } catch (ex) {
        alert("Error: Please enter valid numeric values.");
    }
}

function clearFields() {
    document.getElementById('month').value = "October";
    document.getElementById('baseSalary').value = "938.00";
    document.getElementById('bonus').value = "0.00";
    document.getElementById('duodecimos').value = "NO";
    document.getElementById('shift').value = "1";
    document.getElementById('workingDays').value = "22";
    document.getElementById('monThuNights').value = "0";
    document.getElementById('friNights').value = "0";
    document.getElementById('satNights').value = "0";
    document.getElementById('sunNights').value = "0";
    document.getElementById('irsPercent').value = "0.0";
    document.getElementById('output').textContent = 'Click "Calculate Payslip" to generate the statement.';
}

function exportToPDF() {
    const outputText = document.getElementById('output').textContent;
    if (outputText.includes('Click "Calculate Payslip"')) {
        alert("Please calculate the payslip first before exporting.");
        return;
    }
    window.print();
}