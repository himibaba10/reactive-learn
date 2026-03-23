'use client';

import { generateCertificate } from '@/app/actions/certificate';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

export const DownloadCertificate = ({ courseId }) => {
  const [isCertificateDownloading, setIsCertificateDownloading] =
    useState(false);

  async function handleCertificateDownload() {
    try {
      setIsCertificateDownloading(true);
      const base64 = await generateCertificate(courseId);

      const byteCharacters = atob(base64);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0),
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Certificate.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success('Certificate has been downloaded');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsCertificateDownloading(false);
    }
  }

  return (
    <Button
      onClick={handleCertificateDownload}
      className='w-full mt-6'
      disabled={isCertificateDownloading}
    >
      Download Certificate
    </Button>
  );
};
