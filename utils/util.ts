import moment from "moment";

export function getConstantLabel(
    CONSTANT: ConstantItem[],
    text: string|number
  ): string {
    const found = CONSTANT.find((item) => item.value === text);
    return found ? found.label : "-";
  }
  export function getTagColor(
    CONSTANT: ConstantItem[],
    color: string
  ): string {
    const found = CONSTANT.find((item) => item.value === color);
    return found ? found?.color : "-";
  }
  // For disable future date in Antd DatePicker
export const futureDate = (dateDisable:any) => {
    return dateDisable && dateDisable > moment();
  };
export const formatMoney = (x:number, currency) => {
    if (x === 0) return "0" + (currency ? ` ${currency}` : "");
    if (x) {
      const parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".") + (currency ? ` ${currency}` : "");
    } else {
      return "-";
    }
  };