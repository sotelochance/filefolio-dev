"use client";

import { FileIcon, defaultStyles } from "react-file-icon";
import { ColumnDef } from "@tanstack/react-table";
import prettyBytes from "pretty-bytes";
import { COLOR_EXTENSION_MAP } from "@/constant";
import { File } from "@/lib/Converters/TeamFiles";

export const columns: ColumnDef<File>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ renderValue, ...props }) => {
      const type = renderValue() as string;
      const extension: string = type.split("/")[1];
      return (
        <div className="w-10 mr-3">
          <FileIcon
            extension={extension}
            labelColor={COLOR_EXTENSION_MAP[extension]}
            // @ts-ignore
            {...defaultStyles[extension]}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "filename",
    header: "File Name",
  },
  {
    accessorKey: "fullName",
    header: "Added By",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "timestamp",
    header: "Date Added",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ renderValue, ...props }) => {
      return <span>{prettyBytes(renderValue() as number)}</span>;
    },
  },
  {
    accessorKey: "downloadURL",
    header: "Link",
    cell: ({ renderValue, ...props }) => {
      return (
        <a
          href={renderValue() as string}
          target="_blank"
          className="underline text-blue-500 hover:text-blue-600"
        >
          Download
        </a>
      );
    },
  },
];
