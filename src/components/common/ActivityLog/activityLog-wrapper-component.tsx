"use client";

import { ReactElement, useState } from "react";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLazyGetActivitiesQuery } from "@/rtk-query/shared-query/shared-query";
import ActivityLog from "./activityLog.component";

interface WrapperProps {
  title: string | ReactElement;
  className?: string;
  classNames?: { header: string; body: string };
  children: React.ReactNode;
  path: string;
  id: string;
  item: any;
}

export const ActivityLogWrapperComponent = ({
  title,
  className,
  classNames,
  children,
  path,
  id,
  item,
}: WrapperProps) => {
  const pathname = usePathname();
  const [getActivities, { data: activities, isFetching }] =
    useLazyGetActivitiesQuery();
  const [displayLog, setDisplayLog] = useState<boolean>(false);

  const handleOpenLog = () => {
    setDisplayLog(true);
    getActivities({
      orderBy: [{ field: "createdAt", direction: "desc" }],
      filter: [[{ field: "modelId", value: id, operator: "=" }]],
    });
  };

  return (
    <>
      <Card className={className}>
        <div
          className={`flex justify-between items-center ${
            classNames?.header || ""
          }`}
        >
          <h3 className="text-lg font-semibold">{title}</h3>
          {pathname === path && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleOpenLog}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 fill-current"
                    viewBox="0 0 16 16"
                  >
                    <path d="M7.5 1C6.851563 1 6.300781 1.421875 6.09375 2L3.5 2C2.675781 2 2 2.675781 2 3.5L2 12.5C2 13.324219 2.675781 14 3.5 14L11.5 14C12.324219 14 13 13.324219 13 12.5L13 3.5C13 2.675781 12.324219 12.324219 11.5 2L8.90625 2C8.699219 1.421875 8.148438 1 7.5 1 Z M 7.5 2C7.78125 2 8 2.21875 8 2.5L8 3L9 3L9 4L6 4L6 3L7 3L7 2.5C7 2.21875 7.21875 2 7.5 2 Z M 3.5 3L5 3L5 5L10 5L10 3L11.5 3C11.78125 3 12 3.21875 12 3.5L12 12.5C12 12.78125 11.78125 13 11.5 13L3.5 13C3.21875 13 3 12.78125 3 12.5L3 3.5C3 3.21875 3.21875 3 3.5 3 Z M 4 7L4 8L5 8L5 7 Z M 6 7L6 8L11 8L11 7 Z M 4 10L4 11L5 11L5 10 Z M 6 10L6 11L11 11L11 10Z" />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span className="text-xs">Activity logger</span>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className={classNames?.body || ""}>{children}</div>
      </Card>

      <Dialog open={displayLog} onOpenChange={setDisplayLog}>
        <DialogContent>
          <ActivityLog
            displayLog={displayLog}
            setDisplayLog={setDisplayLog}
            activities={activities}
            loading={isFetching}
            item={item}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
