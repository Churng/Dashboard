function downloadCsvFile() {
	const fileName = "template.csv";
	const customDownloadURL = downloadURL + fileName;

	const downloadLink = document.createElement("a");
	downloadLink.href = customDownloadURL;
	downloadLink.download = fileName;

	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}
