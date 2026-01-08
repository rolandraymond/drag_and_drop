import JSZip from 'jszip';

type ZipFile = {
  name: string;
  content: string;
};

export async function downloadZip(zipName: string, files: ZipFile[]) {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.name, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = zipName;
  a.rel = 'noopener';
  a.click();

  URL.revokeObjectURL(url);
}
