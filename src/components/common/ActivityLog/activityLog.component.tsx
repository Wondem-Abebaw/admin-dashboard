"use client";

import { X, Check, Edit, Trash2, PlusSquare, History, Ban } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import dateFormat from "dateformat";
import { Collection } from "@/models/collection.model";
import { Activity } from "@/models/activity.model";

interface ActivityLogProps {
  displayLog: boolean;
  setDisplayLog: Function;
  activities?: Collection<Activity>;
  loading?: boolean;
  item?: any;
}

const ActivityLog = ({
  displayLog,
  setDisplayLog,
  activities,
  loading,
  item,
}: ActivityLogProps) => {
  if (!displayLog) return null;

  const getActivityColor = (action: string) => {
    switch (action) {
      case "Create":
      case "Update":
      case "Activate":
        return "text-green-500";
      case "Archive":
      case "Block":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "Create":
        return <PlusSquare className="h-4 w-4" />;
      case "Update":
        return <Edit className="h-4 w-4" />;
      case "Archive":
        return <Trash2 className="h-4 w-4" />;
      case "Activate":
        return <Check className="h-4 w-4" />;
      case "Block":
        return <Ban className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-72 border rounded-lg p-2 bg-white shadow-md dark:bg-gray-900">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h3 className="font-semibold text-gray-800 dark:text-white">
          Activity Logger
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setDisplayLog(false)}
              className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-white" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <span className="text-xs">Close logger</span>
          </TooltipContent>
        </Tooltip>
      </div>

      {item && (
        <div className="space-y-4">
          {loading && (
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          )}

          {activities?.data?.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div
                className={cn(
                  "rounded-full p-1",
                  getActivityColor(activity.action)
                )}
              >
                {getActivityIcon(activity.action)}
              </div>
              <div>
                <p className="font-semibold">{activity.action}</p>
                <p className="text-sm text-gray-500">
                  {activity.action === "Block"
                    ? `${activity.action}ed by `
                    : `${activity.action}d by `}
                  <span className="font-medium">{activity?.user?.name}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {dateFormat(activity?.createdAt, "ddd, mmm d, yyyy, h:MM TT")}
                </p>
              </div>
            </div>
          ))}

          {item.data?.deletedAt && (
            <div className="flex items-start space-x-3">
              <div className="rounded-full p-1 text-red-500">
                <Trash2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Deleted by{" "}
                  <span className="font-medium">{item.data?.user?.name}</span>
                </p>
                <p className="text-xs text-gray-400">
                  {dateFormat(
                    item.data?.deletedAt,
                    "ddd, mmm d, yyyy, h:MM TT"
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
