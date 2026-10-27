function calculateSalary() {
    const months = {
        1: "January", 2: "February", 3: "March", 4: "April",
        5: "May", 6: "June", 7: "July", 8: "August",
        9: "September", 10: "October", 11: "November", 12: "December"
    };

    // Lê o nome do funcionário e o mês selecionado no dropdown
    const employeeName = document.getElementById('employeeName').value.trim() || "Employee";
    let monthNum = parseInt(document.getElementById('monthSelect').value) || 10;
    if (!months[monthNum]) monthNum = 10;
    const monthName = months[monthNum];

    const contractBaseSalary = parseFloat(document.getElementById('contractBaseSalary').value) || 938;
    const bonus = parseFloat(document.getElementById('bonus').value) || 0;
    const duodecimosOpt = document.getElementById('duodecimosOpt').value;
    const shift = document.getElementById('shift').value;
    const workingDays = parseInt(document.getElementById('workingDays').value) || 22;

    const weekdayNights = parseInt(document.getElementById('weekdayNights').value) || 0;
    const fridayNights = parseInt(document.getElementById('fridayNights').value) || 0;
    const saturdayNights = parseInt(document.getElementById('saturdayNights').value) || 0;
    const sundayNights = parseInt(document.getElementById('sundayNights').value) || 0;

    const nightShiftDays = weekdayNights + fridayNights + saturdayNights + sundayNights;
    const totalWeekendNights = saturdayNights + sundayNights;
    const irsPercent = parseFloat(document.getElementById('irsPercent').value) || 0;

    // Calculations
    const standardWorkingDays = 22;
    const baseDailyRate = contractBaseSalary / standardWorkingDays;
    const effectiveBaseSalary = baseDailyRate * workingDays;

    const weeklyHours = 40;
    const vr = (contractBaseSalary * 12) / (52 * weeklyHours);

    let holidayAllowanceDuodecimo = 0.0;
    let christmasAllowanceDuodecimo = 0.0;
    if (duodecimosOpt === "YES") {
        holidayAllowanceDuodecimo = contractBaseSalary / 12;
        christmasAllowanceDuodecimo = contractBaseSalary / 12;
    }

    const rate29 = vr * 0.29;
    const rate58 = vr * 0.58;

    let shiftDesc = "";
    let h29w = 0, h58w = 0, h29f = 0, h58f = 0, h29Sat = 0, h58Sat = 0, h29Sun = 0, h58Sun = 0;

    if (shift === "1") {
        shiftDesc = "21:00 to 06:00";
        h29w = 2.0; h58w = 6.0; h29f = 2.0; h58f = 6.0; h29Sat = 3.0; h58Sat = 6.0; h29Sun = 3.0; h58Sun = 6.0;
    } else if (shift === "2") {
        shiftDesc = "23:00 to 08:00";
        h29w = 1.0; h58w = 7.0; h29f = 2.0; h58f = 7.0; h29Sat = 2.0; h58Sat = 7.0; h29Sun = 1.0; h58Sun = 7.0;
    } else if (shift === "3") {
        shiftDesc = "15:00 to 00:00";
        h29w = 2.0; h58w = 0.0; h29f = 2.0; h58f = 0.0; h29Sat = 8.0; h58Sat = 0.0; h29Sun = 8.0; h58Sun = 0.0;
    }

    const totalHours29 = (h29w * weekdayNights) + (h29f * fridayNights) + (h29Sat * saturdayNights) + (h29Sun * sundayNights);
    const totalHours58 = (h58w * weekdayNights) + (h58f * fridayNights) + (h58Sat * saturdayNights) + (h58Sun * sundayNights);

    const total29Month = totalHours29 * rate29;
    const total58Month = totalHours58 * rate58;
    const nightShiftTotal = total29Month + total58Month;

    const dailyMealAllowance = 7.00;
    const totalMealAllowance = dailyMealAllowance * workingDays;

    const taxableBase = effectiveBaseSalary + nightShiftTotal + bonus + holidayAllowanceDuodecimo + christmasAllowanceDuodecimo;

    const ssBaseEarnings = effectiveBaseSalary + nightShiftTotal + bonus;
    const socialSecurityBase = ssBaseEarnings * 0.11;
    const ssHolidayDuodecimo = holidayAllowanceDuodecimo * 0.11;
    const ssChristmasDuodecimo = christmasAllowanceDuodecimo * 0.11;
    const totalSocialSecurity = socialSecurityBase + ssHolidayDuodecimo + ssChristmasDuodecimo;

    const irsDeduction = taxableBase * (irsPercent / 100.0);
    const totalDeductions = irsDeduction + totalSocialSecurity;

    const totalEarnings = taxableBase + totalMealAllowance;
    const netBankSalary = taxableBase - totalDeductions;
    const totalNetGeneral = netBankSalary + totalMealAllowance;

    let baseDesc = "";
    if (workingDays === standardWorkingDays) {
        baseDesc = `Base Salary (${workingDays} working days - Standard Full): EUR ${effectiveBaseSalary.toFixed(2)} (EUR ${baseDailyRate.toFixed(2)}/day)`;
    } else if (workingDays < standardWorkingDays) {
        baseDesc = `Base Salary (${workingDays} working days - Proportional): EUR ${effectiveBaseSalary.toFixed(2)} (EUR ${baseDailyRate.toFixed(2)}/day)`;
    } else {
        let extraDays = workingDays - standardWorkingDays;
        baseDesc = `Base Salary (${workingDays} working days - Includes ${extraDays} extra day(s) worked): EUR ${effectiveBaseSalary.toFixed(2)} (EUR ${baseDailyRate.toFixed(2)}/day)`;
    }

    let output = `${"=".repeat(68)}
      SALARY STATEMENT / PAYSLIP - ${monthName.toUpperCase()} 2026
      Employee: ${employeeName}
      Teleperformance Portugal | Google Project
      Created by Rafael Virgens
${"=".repeat(68)}

[ EARNINGS / ABONOS ]
  • ${baseDesc}
  • Night Shift Allowance (${nightShiftDays} total nights: ${weekdayNights} Mon-Thu, ${fridayNights} Fri, ${saturdayNights} Sat, ${sundayNights} Sun):
      - Shift Option: ${shiftDesc} | Weekend Nights Worked: ${totalWeekendNights}
      - 29% Bracket Total: EUR ${total29Month.toFixed(2)} (${totalHours29.toFixed(1)} hours total @ EUR ${rate29.toFixed(4)}/h)
      - 58% Bracket Total: EUR ${total58Month.toFixed(2)} (${totalHours58.toFixed(1)} hours total @ EUR ${rate58.toFixed(4)}/h)
  • Productivity Bonus: EUR ${bonus.toFixed(2)}`;

    if (duodecimosOpt === "YES") {
        output += `\n  • Holiday Allowance (Duodecimo): EUR ${holidayAllowanceDuodecimo.toFixed(2)}`;
        output += `\n  • Christmas Allowance (Duodecimo): EUR ${christmasAllowanceDuodecimo.toFixed(2)}`;
    } else {
        output += `\n  • Duodecimos (Holiday/Christmas): Not applicable (paid in standard months)`;
    }

    output += `\n  • Meal Allowance TAX FREE (Cover FLEX Card): EUR ${totalMealAllowance.toFixed(2)} (${workingDays} working days × EUR ${dailyMealAllowance.toFixed(2)})

[ DEDUCTIONS / DESCONTOS ]
  • IRS Withholding Tax (${irsPercent}%): EUR ${irsDeduction.toFixed(2)}
  • Social Security (Base/Bonus/Night Shift) (11%): EUR ${socialSecurityBase.toFixed(2)}
  • Social Security (Holiday Allowance) (11%): EUR ${ssHolidayDuodecimo.toFixed(2)}
  • Social Security (Christmas Allowance) (11%): EUR ${ssChristmasDuodecimo.toFixed(2)}

${"-".repeat(68)}
  > TOTAL TAXABLE GROSS: EUR ${taxableBase.toFixed(2)}
  > TOTAL EARNINGS (ABONOS TOTAL): EUR ${totalEarnings.toFixed(2)}
  > TOTAL DEDUCTIONS (DESCONTOS TOTAL): EUR ${totalDeductions.toFixed(2)}
${"-".repeat(68)}
  💳 MEAL ALLOWANCE TAX FREE (Cover FLEX Card): EUR ${totalMealAllowance.toFixed(2)}
  💰 REMAINING NET SALARY (Bank Transfer Net): EUR ${netBankSalary.toFixed(2)}
  🌟 TOTAL GENERAL NET (Bank + Cover FLEX): EUR ${totalNetGeneral.toFixed(2)}
${"=".repeat(68)}`;

    document.getElementById('outputContent').innerText = output;
    const resultSection = document.getElementById('resultSection');
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth' });
}