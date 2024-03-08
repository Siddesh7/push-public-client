import {ConnectButton} from "@rainbow-me/rainbowkit";

const Landing = () => {
  return (
    <div className="hero-content text-center min-h-[80vh] w-full m-auto flex items-center justify-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold">gm anon!</h1>
        <p className="py-6">
          Connect your wallet or sign in using email to start Chattin&apos;!
        </p>

        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const connected = mounted && account && chain;
            return (
              <div
                {...(!mounted && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        className={"btn btn-primary"}
                        type="button"
                      >
                        Connect Wallet
                      </button>
                    );
                  }
                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        className="btn btn-error"
                        type="button"
                      >
                        Wrong network
                      </button>
                    );
                  }
                  return (
                    <div>
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="btn btn-success"
                      >
                        Connected {account.displayName}
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default Landing;
