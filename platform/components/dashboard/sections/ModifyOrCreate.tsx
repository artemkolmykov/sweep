import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Popover, PopoverTrigger, PopoverContent } from "../../ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../../ui/command";
import React, { useState } from "react";
import { getFile } from "../../../lib/api.service";
import { Snippet } from "../../../lib/search";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { FileChangeRequest } from "../../../lib/types";

const ModifyOrCreate = ({
  filePath,
  repoName,
  files,
  directories,
  fileChangeRequests,
  setFileChangeRequests,
}: {
  filePath: string;
  repoName: string;
  files: { label: string; name: string }[];
  directories: { label: string; name: string }[];
  fileChangeRequests: FileChangeRequest[];
  setFileChangeRequests: React.Dispatch<
    React.SetStateAction<FileChangeRequest[]>
  >;
}) => {
  const [openModify, setOpenModify] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div className="flex flex-row mb-4">
    <Popover open={openModify} onOpenChange={setOpenModify}>
      <div className="flex flex-row mb-4 overflow-auto">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openModify}
            className="w-full justify-between overflow-hidden"
            disabled={files.length === 0}
          >
            Get Sweep to Modify Files
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0 text-left">
        <Command>
          <CommandInput placeholder="Search for a file to modify..." className="h-9" />
          <CommandEmpty>No file found.</CommandEmpty>
          <CommandGroup>
            {files.map((file: any) => (
              <CommandItem
                key={file.value}
                value={file.value}
                onSelect={async (currentValue) => {
                  // ensure file is not already included
                  if (
                    fileChangeRequests.some(
                      (fcr: FileChangeRequest) =>
                        fcr.snippet.file === file.value,
                    )
                  ) {
                    return;
                  }
                  const contents = (await getFile(repoName, file.value))
                    .contents;
                  setFileChangeRequests((prev: FileChangeRequest[]) => {
                    let snippet = {
                      file: file.value,
                      start: 0,
                      end: contents.split("\n").length,
                      entireFile: contents,
                      content: contents, // this is the slice based on start and end, remeber to change this
                    } as Snippet;
                    return [
                      ...prev,
                      {
                        snippet,
                        changeType: "modify",
                        newContents: contents,
                        hideMerge: true,
                        instructions: "",
                        isLoading: false,
                        openReadOnlyFiles: false,
                        readOnlySnippets: {},
                      } as FileChangeRequest,
                    ];
                  });
                  setOpenModify(false);
                }}
              >
                {file.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    filePath === file.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
    <Popover open={openCreate} onOpenChange={setOpenCreate}>
      <div className="flex flex-row mb-4 overflow-auto">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCreate}
            className="w-full justify-between overflow-hidden"
            disabled={files.length === 0}
          >
            Get Sweep to Create a File
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0 text-left">
        <Command>
          <CommandInput placeholder="Search for a directory..." className="h-9" />
          <CommandEmpty>No directory found.</CommandEmpty>
          <CommandGroup>
            {directories.map((dir: any) => (
              <CommandItem
                key={dir.value}
                value={dir.value}
                onSelect={async (currentValue) => {
                  setFileChangeRequests((prev: FileChangeRequest[]) => {
                    let snippet = {
                      file: dir.value,
                      start: 0,
                      end: 0,
                      entireFile: "",
                      content: "",
                    } as Snippet;
                    return [
                      ...prev,
                      {
                        snippet,
                        changeType: "create",
                        newContents: "",
                        hideMerge: true,
                        instructions: "",
                        isLoading: false,
                        openReadOnlyFiles: false,
                        readOnlySnippets: {},
                      } as FileChangeRequest,
                    ];
                  });
                  setOpenCreate(false);
                }}
              >
                {dir.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    filePath === dir.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
    </div>
  );
};
export default ModifyOrCreate;
