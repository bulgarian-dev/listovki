
import React from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

interface ResourceRendererProps {
  data: any;
  type: string;
}

export default function ResourceRenderer({
  data,
  type,
}: ResourceRendererProps) {
  const renderTable = (tableData: any) => {
    if (!tableData.headers || !tableData.rows) {
      return <div>Invalid table data format</div>;
    }

    return (
      <div>
        {tableData.description && (
          <p className="mb-4 text-default-600">{tableData.description}</p>
        )}

        <div className="overflow-x-auto">
          <Table
            aria-label={tableData.title || "Resource table"}
            className="min-w-full">
            <TableHeader>
              {tableData.headers.map((header: string, index: number) => (
                <TableColumn
                  key={index}
                  className={
                    index === 0
                      ? "bg-default-100 font-bold"
                      : "text-center bg-default-100 font-bold"
                  }>
                  {header}
                </TableColumn>
              ))}
            </TableHeader>
            <TableBody>
              {tableData.rows.map((row: any[], rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className={
                        cellIndex === 0 ? "font-medium" : "text-center"
                      }>
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Display notes if they exist */}
        {tableData.notes && tableData.notes.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2">Notes:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-default-600">
              {tableData.notes.map((note: string, index: number) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  
  };

  const renderImage = (imageData: any) => {
    return (
      <div className="flex flex-col items-center">
        {imageData.description && (
          <p className="text-default-600 mb-4">{imageData.description}</p>
        )}
        <div className="relative max-w-full">
          <Image
            src={imageData.url}
            alt={imageData.altText || "Resource image"}
            width={imageData.width || 800}
            height={imageData.height || 600}
            className="object-contain"
          />
        </div>
      </div>
    );
  };

  const renderText = (textData: any) => {
    return (
      <div
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: textData.content }}
      />
    );
  };

  const renderPdf = (pdfData: any) => {
    return (
      <div className="flex flex-col items-center">
        {pdfData.description && <p className="mb-4">{pdfData.description}</p>}
        <a
          href={pdfData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition">
          {pdfData.buttonText || "View PDF"}
        </a>
      </div>
    );
  };

  const renderList = (listData: any) => {
    return (
      <div>
        {listData.description && <p className="mb-4">{listData.description}</p>}
        <ul className="list-disc pl-5 space-y-2">
          {listData.items.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  switch (type) {
    case "table":
      return renderTable(data);
    case "image":
      return renderImage(data);
    case "text":
      return renderText(data);
    case "pdf":
      return renderPdf(data);
    case "list":
      return renderList(data);
    case "composite":
      return (
        <div className="space-y-8">
          {data.sections.map((section: any, index: number) => (
            <div key={index} className="mb-6">
              {section.title && (
                <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
              )}
              <ResourceRenderer data={section.content} type={section.type} />
            </div>
          ))}
        </div>
      );
    default:
      return <div>Unknown resource type: {type}</div>;
  }
}
