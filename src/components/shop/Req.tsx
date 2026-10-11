/** Red asterisk marking a required field. The input itself carries `required` for assistive tech. */
export function Req() {
  return <span aria-hidden="true" style={{ color: "#D32F2F", marginLeft: 3 }}>*</span>;
}
