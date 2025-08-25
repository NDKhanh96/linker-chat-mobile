{
  description = "Linker Chat Mobile - React Native Expo App";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        nixPackages = nixpkgs.legacyPackages.${system};

        # Platform-specific packages
        darwinOnlyPackages =
          with nixPackages;
          lib.optionals stdenv.isDarwin [
            rubyPackages_3_2.cocoapods # CocoaPods 1.16.2 for iOS dependencies
            ruby_3_2 # Ruby 3.2 for CocoaPods and fastlane
            fastlane # fastlane 2.227.1 for iOS/Android deployment
          ];

        linuxOnlyPackages =
          with nixPackages;
          lib.optionals stdenv.isLinux [
            # Linux-specific Android tools if needed
          ];

        # Common packages for all platforms
        commonPackages = with nixPackages; [
          nodejs_20 # Node.js 20.19.2 (downgrade from 22 to 20)
          yarn # Yarn 1.22.22
          git
          jdk17 # Java 17 for Android development
          android-tools # ADB and other Android tools
          watchman # File watching for Metro bundler
          python3 # Python for node-gyp
          nodePackages.node-gyp # node-gyp 11.2.0 for native modules
          jq # jq 1.8.0 for JSON processing
        ];
      in
      {
        devShells.default = nixPackages.mkShell {
          buildInputs = commonPackages ++ darwinOnlyPackages ++ linuxOnlyPackages;

          shellHook = ''
            echo "🚀 Linker Chat Mobile Development Environment"
            echo "📱 React Native + Expo project ready!"
            echo "🖥️  Platform: ${system}"
            echo ""
            echo "📦 Environment versions:"
            echo "  Node.js: $(node --version) (target: v20.19.2)"
            echo "  Yarn: $(yarn --version) (target: 1.22.22)"
            echo "  Java: $(java -version 2>&1 | head -n1) (target: 17)"
            echo "  node-gyp: $(node-gyp --version) (target: 11.2.0)"
            echo "  jq: $(jq --version) (target: 1.8.0)"
            ${
              if nixPackages.stdenv.isDarwin then
                ''
                  echo "  CocoaPods: $(pod --version 2>/dev/null || echo 'not found') (target: 1.16.2)"
                  echo "  fastlane: $(fastlane --version 2>/dev/null | head -n1 || echo 'not found') (target: 2.227.1)"
                  echo "  Ruby: $(ruby --version) (target: 3.2)"
                ''
              else
                ""
            }
            echo ""
            echo "Available commands:"
            echo "  npm start        - Start Expo dev server"
            echo "  npm run android  - Run on Android"
            ${if nixPackages.stdenv.isDarwin then ''echo "  npm run ios      - Run on iOS"'' else ""}
            echo "  npm run web      - Run on web"
            echo "  npm test         - Run tests"
            echo "  npm run lint     - Lint code"
            echo ""
            echo "📋 Make sure you have:"
            echo "  - Expo CLI: npm install -g @expo/cli"
            echo "  - Android Studio with NDK 26.1.10909125"
            ${if nixPackages.stdenv.isDarwin then ''echo "  - iOS Simulator (Xcode)"'' else ""}
            echo ""

            # Platform-specific Android SDK setup
            ${
              if nixPackages.stdenv.isDarwin then
                ''
                  # macOS Android SDK path
                  export ANDROID_HOME="$HOME/Library/Android/sdk"
                ''
              else
                ''
                  # Linux Android SDK path  
                  export ANDROID_HOME="$HOME/Android/Sdk"
                ''
            }
            export ANDROID_SDK_ROOT="$ANDROID_HOME"
            export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH"

            # Set up Java for Android development
            export JAVA_HOME="${nixPackages.jdk17}/lib/openjdk"

            # Set up NDK path for React Native
            export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/26.1.10909125"
            export NDK_HOME="$ANDROID_NDK_HOME"

            # Set up Python for node-gyp
            export PYTHON="${nixPackages.python3}/bin/python3"

            # Ensure npm dependencies are installed
            if [ ! -d "node_modules" ]; then
              echo "📦 Installing npm dependencies..."
              npm install
            fi

            # Platform-specific notes
            ${
              if nixPackages.stdenv.isDarwin then
                ''
                  echo "🍎 macOS detected - iOS development available!"
                  echo "💎 Ruby/CocoaPods/fastlane configured for iOS deployment"
                ''
              else
                ''
                  echo "🐧 Linux detected - Android development only"
                  echo "💡 Note: iOS development requires macOS"
                ''
            }

            echo ""
            echo "🔧 Environment ready! Use 'npm start' to begin development."
          '';

          # Không cho dev expo thu thập dữ liệu
          EXPO_NO_TELEMETRY = "1";
        };
      }
    );
}
