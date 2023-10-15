// Success
function showSuccessLoginNotification() {
	toastr.success("", "成功登入！");
}

function showSuccessFileNotification() {
	toastr.success("上傳成功，畫面將重新整理後更新！", "成功");
}

function showSuccessFileDeleteNotification() {
	toastr.success("文件已刪除", "刪除成功");
}

// Error
function showErrorNotification() {
	toastr.error("Error", "錯誤");
}

function showErrorFileNotification() {
	toastr.error("上傳失敗，請再重新操作一次", "失敗");
}

// Warning
function showWarningNotification() {
	toastr.warning("請上傳檔案！", "提醒");
}

function showWarningContentNotification() {
	toastr.warning("請新增內容！", "提醒");
}
function showWarningFileNotification() {
	toastr.warning("請重新選擇檔案！", "提醒");
}
// Info
function showInfoNotification() {
	toastr.info("", "已選擇檔案");
}
