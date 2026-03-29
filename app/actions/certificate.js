'use server';

import { actionError, actionSuccess } from '@/lib/actionResponse';
import { auth } from '@/auth';
import { formatDate } from '@/lib/formatDate';
import { getCourseDetails } from '@/queries/courses.queries';
import { getAReport } from '@/queries/report.queries';
import { getUserByEmail } from '@/queries/user.queries';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// Fetch custom fonts
const kalamFontUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/kalam/Kalam-Regular.ttf`;
const kalamFontBytes = await fetch(kalamFontUrl).then((res) =>
  res.arrayBuffer(),
);

const montserratItalicFontUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/montserrat/Montserrat-Italic.ttf`;
const montserratItalicFontBytes = await fetch(montserratItalicFontUrl).then(
  (res) => res.arrayBuffer(),
);

const montserratFontUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/fonts/montserrat/Montserrat-Medium.ttf`;
const montserratFontBytes = await fetch(montserratFontUrl).then((res) =>
  res.arrayBuffer(),
);

export async function generateCertificate(courseId) {
  try {
    /* -----------------
     *
     * Configuratios
     *
     *-------------------*/
    const course = await getCourseDetails(courseId);
    const session = await auth();
    const loggedInUser = await getUserByEmail(session?.user?.email);

    const report = await getAReport({
      course: courseId,
      student: loggedInUser.id,
    });

    const completionDate = report?.completionDate
      ? formatDate(report?.completionDate)
      : formatDate(Date.now());

    const completionInfo = {
      name: `${loggedInUser?.firstName} ${loggedInUser?.lastName}`,
      completionDate: completionDate,
      courseName: course.title,
      instructor: `${course?.instructor?.firstName} ${course?.instructor?.lastName}`,
      instructorDesignation: `${course?.instructor?.designation}`,
      sign: '/reactive-ferdous-logo.png',
    };

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const kalamFont = await pdfDoc.embedFont(kalamFontBytes);
    const montserratItalic = await pdfDoc.embedFont(montserratItalicFontBytes);

    const montserrat = await pdfDoc.embedFont(montserratFontBytes);

    const page = pdfDoc.addPage([841.89, 595.28]);
    const { width, height } = page.getSize();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    /* -----------------
     *
     * Logo
     *
     *-------------------*/
    const logoFontSize = 30;
    const logoText = 'Reactive Learn';
    // title text width
    const logoTextWidth = montserrat.widthOfTextAtSize(logoText, logoFontSize);

    page.drawText(logoText, {
      x: width / 2 - logoTextWidth / 2,
      y: height - 100,
      size: logoFontSize,
      font: montserrat,
      color: rgb(0, 0, 0),
    });

    /* -----------------
     *
     * Title
     *
     *-------------------*/

    const titleFontSize = 30;
    const titleText = 'Certificate Of Completion';
    // title text width
    const titleTextWidth = montserrat.widthOfTextAtSize(
      titleText,
      titleFontSize,
    );

    page.drawText(titleText, {
      x: width / 2 - titleTextWidth / 2,
      y: height - 140,
      size: titleFontSize,
      font: montserrat,
      color: rgb(0, 0.53, 0.71),
    });

    /* -----------------
     *
     * Name Label
     *
     *-------------------*/
    const nameLabelText = 'This certificate is hereby bestowed upon';

    const nameLabelFontSize = 20;
    // title text width
    const nameLabelTextWidth = montserratItalic.widthOfTextAtSize(
      nameLabelText,
      nameLabelFontSize,
    );

    page.drawText(nameLabelText, {
      x: width / 2 - nameLabelTextWidth / 2,
      y: height - 190,
      size: nameLabelFontSize,
      font: montserratItalic,
      color: rgb(0, 0, 0),
    });

    /* -----------------
     *
     * Name
     *
     *-------------------*/
    const nameText = completionInfo.name;

    const nameFontSize = 50;
    // title text width
    const nameTextWidth = timesRomanFont.widthOfTextAtSize(
      nameText,
      nameFontSize,
    );

    page.drawText(nameText, {
      x: width / 2 - nameTextWidth / 2,
      y: height - 250,
      size: nameFontSize,
      font: kalamFont,
      color: rgb(0, 0, 0),
    });

    /* -----------------
     *
     * Details Info
     *
     *-------------------*/
    const detailsText = `This is to certify that ${completionInfo.name} successfully completed the ${completionInfo.courseName} course on ${completionInfo.completionDate} by ${completionInfo.instructor}`;

    const detailsFontSize = 16;
    // title text width
    const detailsTextWidth = montserrat.widthOfTextAtSize(
      titleText,
      titleFontSize,
    );

    page.drawText(detailsText, {
      x: width / 2 - 700 / 2,
      y: height - 330,
      size: detailsFontSize,
      font: montserrat,
      color: rgb(0, 0, 0),
      maxWidth: 700,
      wordBreaks: [' '],
    });

    /* -----------------
     *
     * Signatures
     *
     *-------------------*/
    const signatureBoxWidth = 300;
    page.drawText(completionInfo.instructor, {
      x: width - signatureBoxWidth,
      y: 90,
      size: detailsFontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    page.drawText(completionInfo.instructorDesignation, {
      x: width - signatureBoxWidth,
      y: 72,
      size: 10,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
      maxWidth: 250,
    });
    page.drawLine({
      start: { x: width - signatureBoxWidth, y: 110 },
      end: { x: width - 60, y: 110 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });

    const signUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${completionInfo.sign}`;

    const signBytes = await fetch(signUrl).then((res) => res.arrayBuffer());
    const sign = await pdfDoc.embedPng(signBytes);

    page.drawImage(sign, {
      x: width - signatureBoxWidth + 30,
      y: 115,
      width: 150,
      height: 150,
    });

    // pattern
    const patternUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/pattern.jpg`;

    const patternBytes = await fetch(patternUrl).then((res) =>
      res.arrayBuffer(),
    );
    const pattern = await pdfDoc.embedJpg(patternBytes);

    page.drawImage(pattern, {
      x: 0,
      y: 0,
      width: width,
      height: height,
      opacity: 0.2,
    });
    /* -----------------
     *
     * Generate and send Response
     *
     *-------------------*/
    const pdfBytes = await pdfDoc.save();
    const base64 = Buffer.from(pdfBytes).toString('base64');
    return actionSuccess(base64);
  } catch (error) {
    console.error(error);
    return actionError(error);
  }
}
