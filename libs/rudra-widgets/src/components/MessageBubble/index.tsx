import React from "react";

export type MessageBubbleVariant =
  | "incoming"
  | "outgoing"
  | "system";

export interface MessageBubbleProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "children" | "className"
  > {
  children?: React.ReactNode;

  avatar?: React.ReactNode;

  /** @translate */
  sender?: string;

  /** @translate */
  timestamp?: string;

  /** @translate */
  status?: string;

  /** @select|incoming|outgoing|system */
  variant?: MessageBubbleVariant;

  /**
   * Root customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Width",
   *     "prefix":"w",
   *     "type":"select",
   *     "options":[
   *       {"key":"auto","label":"Auto"},
   *       {"key":"full","label":"Full Width"}
   *     ]
   *   },
   *   {
   *     "key":"Gap",
   *     "prefix":"gap",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"},
   *       {"key":"4","label":"Extra Large"}
   *     ]
   *   }
   * ]
   */
  className?: string;

  /**
   * Bubble customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Background",
   *     "prefix":"bg",
   *     "type":"select",
   *     "options":[
   *       {"key":"white","label":"White"},
   *       {"key":"gray-100","label":"Gray 100"},
   *       {"key":"gray-200","label":"Gray 200"},
   *       {"key":"gray-800","label":"Gray 800"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"blue-500","label":"Blue 500"},
   *       {"key":"blue-600","label":"Blue 600"},
   *       {"key":"green-500","label":"Green 500"}
   *     ]
   *   },
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"black","label":"Black"},
   *       {"key":"white","label":"White"},
   *       {"key":"gray-600","label":"Gray 600"},
   *       {"key":"gray-900","label":"Gray 900"}
   *     ]
   *   },
   *   {
   *     "key":"Padding X",
   *     "prefix":"px",
   *     "type":"select",
   *     "options":[
   *       {"key":"2","label":"Small"},
   *       {"key":"3","label":"Medium"},
   *       {"key":"4","label":"Large"},
   *       {"key":"5","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Padding Y",
   *     "prefix":"py",
   *     "type":"select",
   *     "options":[
   *       {"key":"1","label":"Small"},
   *       {"key":"2","label":"Medium"},
   *       {"key":"3","label":"Large"},
   *       {"key":"4","label":"Extra Large"}
   *     ]
   *   },
   *   {
   *     "key":"Radius",
   *     "prefix":"rounded",
   *     "type":"select",
   *     "options":[
   *       {"key":"none","label":"None"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"},
   *       {"key":"2xl","label":"2XL"},
   *       {"key":"3xl","label":"3XL"}
   *     ]
   *   },
   *   {
   *     "key":"Max Width",
   *     "prefix":"max-w",
   *     "type":"select",
   *     "options":[
   *       {"key":"xs","label":"Extra Small"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"md","label":"Medium"},
   *       {"key":"lg","label":"Large"},
   *       {"key":"xl","label":"Extra Large"},
   *       {"key":"2xl","label":"2XL"}
   *     ]
   *   }
   * ]
   */
  bubbleClassName?: string;

  /**
   * Sender customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-500","label":"Gray 500"},
   *       {"key":"gray-700","label":"Gray 700"},
   *       {"key":"gray-900","label":"Gray 900"},
   *       {"key":"white","label":"White"}
   *     ]
   *   },
   *   {
   *     "key":"Font Size",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"xs","label":"Extra Small"},
   *       {"key":"sm","label":"Small"},
   *       {"key":"base","label":"Base"}
   *     ]
   *   },
   *   {
   *     "key":"Font Weight",
   *     "prefix":"font",
   *     "type":"select",
   *     "options":[
   *       {"key":"normal","label":"Normal"},
   *       {"key":"medium","label":"Medium"},
   *       {"key":"semibold","label":"Semi Bold"},
   *       {"key":"bold","label":"Bold"}
   *     ]
   *   }
   * ]
   */
  senderClassName?: string;

  /**
   * Metadata customization.
   * @type|class
   * @schema [
   *   {
   *     "key":"Text Color",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"gray-400","label":"Gray 400"},
   *       {"key":"gray-500","label":"Gray 500"},
   *       {"key":"gray-600","label":"Gray 600"},
   *       {"key":"white","label":"White"}
   *     ]
   *   },
   *   {
   *     "key":"Font Size",
   *     "prefix":"text",
   *     "type":"select",
   *     "options":[
   *       {"key":"xs","label":"Extra Small"},
   *       {"key":"sm","label":"Small"}
   *     ]
   *   }
   * ]
   */
  metaClassName?: string;
}

export default function MessageBubble({
  children,
  avatar,
  sender,
  timestamp,
  status,
  variant = "incoming",
  className = "",
  bubbleClassName = "",
  senderClassName = "",
  metaClassName = "",
  ...props
}: MessageBubbleProps) {
  if (variant === "system") {
    return (
      <div
        {...props}
        className={[
          "flex w-full justify-center",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            "max-w-lg rounded-full bg-gray-100 px-4 py-2",
            "text-center text-xs text-gray-500",
            bubbleClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>
      </div>
    );
  }

  const outgoing = variant === "outgoing";

  return (
    <div
      {...props}
      className={[
        "flex w-full gap-2",
        outgoing
          ? "justify-end"
          : "justify-start",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {!outgoing && avatar && (
        <div className="shrink-0 self-end">
          {avatar}
        </div>
      )}

      <div
        className={[
          "flex min-w-0 max-w-[80%] flex-col",
          outgoing
            ? "items-end"
            : "items-start",
        ].join(" ")}
      >
        {sender && (
          <div
            className={[
              "mb-1 px-1 text-xs font-medium text-gray-500",
              senderClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {sender}
          </div>
        )}

        <div
          className={[
            "max-w-full break-words px-4 py-2",
            "text-sm",
            outgoing
              ? "rounded-2xl rounded-br-sm bg-blue-600 text-white"
              : "rounded-2xl rounded-bl-sm bg-gray-100 text-gray-900",
            bubbleClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {children}
        </div>

        {(timestamp || status) && (
          <div
            className={[
              "mt-1 flex items-center gap-2 px-1",
              "text-xs text-gray-400",
              metaClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {timestamp && (
              <span>{timestamp}</span>
            )}

            {status && (
              <span>{status}</span>
            )}
          </div>
        )}
      </div>

      {outgoing && avatar && (
        <div className="shrink-0 self-end">
          {avatar}
        </div>
      )}
    </div>
  );
}