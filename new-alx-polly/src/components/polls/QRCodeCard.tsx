// src/components/polls/QRCodeCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

type QRCodeCardProps = {
  pollId: string;
  pollUrl: string;
};

export function QRCodeCard({ pollUrl }: QRCodeCardProps) {
  // In a real implementation, we would use a QR code generation library
  // such as react-qr-code or qrcode.react
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(pollUrl);
    // In a real implementation, we would show a toast notification
    alert('Poll link copied to clipboard!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Share this Poll</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {/* Placeholder for QR code */}
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center border">
            <p className="text-gray-500 text-center p-4">
              QR Code Placeholder<br />
              (Will use actual QR code library in implementation)
            </p>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-gray-500 mb-2 truncate">{pollUrl}</p>
          <Button onClick={handleCopyLink} variant="outline" className="w-full">
            Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}