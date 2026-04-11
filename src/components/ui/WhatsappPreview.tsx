'use client'

interface DefaultPreviewProps {
  body?: string;
  headerType?: "none" | "text" | "image" | "video" | "document";
  headerValue?: string;
  footer?: string;
  buttons?: { type: string; text: string }[];
  authMode?: false;
}

interface AuthPreviewProps {
  authMode: true;
  addSecurity: boolean;
  expirationMinutes: number | undefined;
  otpButtonText: string;
}

type WhatsappPreviewProps = DefaultPreviewProps | AuthPreviewProps;

export function WhatsappPreview(props: WhatsappPreviewProps) {
  const isAuthMode = "authMode" in props && props.authMode;

  // Replace {{variable}} placeholders with styled spans
  const renderBody = (text: string) => {
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, i) => {
      if (/\{\{[^}]+\}\}/.test(part)) {
        const varName = part.replace(/^\{\{|\}\}$/g, "");
        return (
          <span key={i} className="text-gray-400 italic">
            [variable {varName}]
          </span>
        );
      }
      return part;
    });
  };

  const renderAuthContent = () => {
    const { addSecurity, expirationMinutes, otpButtonText } =
      props as AuthPreviewProps;

    return (
      <>
        {/* Chat Bubble */}
        <div className="bg-white rounded-lg rounded-tl-none shadow-sm">
          <div className="p-2.5">
            {/* Body */}
            <p className="text-xs text-gray-800 leading-relaxed">
              <span className="font-mono bg-gray-100 px-1 rounded">
                123456
              </span>{" "}
              is your verification code.
              {addSecurity && (
                <>
                  {" "}
                  For your security, do not share this code.
                </>
              )}
            </p>

            {/* Footer */}
            {expirationMinutes != null && (
              <p className="text-[10px] text-gray-400 mt-1.5">
                This code expires in {expirationMinutes} minutes.
              </p>
            )}

            {/* Timestamp */}
            <div className="flex justify-end mt-1">
              <span className="text-[9px] text-gray-400">10:30 AM</span>
            </div>
          </div>

          {/* Button */}
          <div className="border-t border-gray-100">
            <div className="border-b border-gray-100 last:border-b-0">
              <button
                type="button"
                className="w-full text-xs text-[#00A5F4] py-2 font-medium text-center"
              >
                {otpButtonText || "Copy Code"}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderDefaultContent = () => {
    const {
      body,
      headerType = "none",
      headerValue,
      footer,
      buttons = [],
    } = props as DefaultPreviewProps;

    const hasContent =
      body ||
      (headerType !== "none" && headerValue) ||
      footer ||
      buttons.length > 0;

    if (!hasContent) {
      return (
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-xs text-gray-500">
            Fill the form to see a live preview
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-[85%]">
        {/* Chat Bubble */}
        <div className="bg-white rounded-lg rounded-tl-none shadow-sm">
          <div className="p-2.5">
            {/* Header */}
            {headerType === "text" && headerValue && (
              <p className="font-bold text-sm text-gray-900 mb-1">
                {headerValue}
              </p>
            )}
            {headerType !== "none" && headerType !== "text" && (
              <div className="bg-gray-100 rounded h-20 flex items-center justify-center mb-2">
                <span className="text-xs text-gray-400 uppercase">
                  {headerType} placeholder
                </span>
              </div>
            )}

            {/* Body */}
            {body && (
              <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                {renderBody(body)}
              </p>
            )}

            {/* Footer */}
            {footer && (
              <p className="text-[10px] text-gray-400 mt-1.5">{footer}</p>
            )}

            {/* Timestamp */}
            <div className="flex justify-end mt-1">
              <span className="text-[9px] text-gray-400">10:30 AM</span>
            </div>
          </div>

          {/* Buttons */}
          {buttons.length > 0 && (
            <div className="border-t border-gray-100">
              {buttons.map((btn, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  <button
                    type="button"
                    className="w-full text-xs text-[#00A5F4] py-2 font-medium text-center"
                  >
                    {btn.text || "Button"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Live Preview
      </h2>

      {/* Phone Frame */}
      <div className="mx-auto bg-black rounded-[2rem] p-2 w-64">
        <div className="bg-white rounded-[1.5rem] h-[480px] overflow-hidden flex flex-col">
          {/* WhatsApp Top Bar */}
          <div className="bg-[#075E54] px-4 py-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-600">B</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Business</p>
              <p className="text-green-200 text-[10px]">online</p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-[#ECE5DD] p-3 overflow-y-auto">
            {isAuthMode ? (
              <div className="max-w-[85%]">{renderAuthContent()}</div>
            ) : (
              renderDefaultContent()
            )}
          </div>

          {/* Input Bar */}
          <div className="bg-[#F0F0F0] px-3 py-2 flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full px-3 py-1.5">
              <span className="text-[10px] text-gray-400">
                Type a message
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-[#075E54] flex items-center justify-center">
              <span className="text-white text-[10px]">&#9658;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
