{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-22.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = inputs.nixpkgs.legacyPackages.${system};
      in
      rec { # rec makes the attributeset recursive, for self referencing
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [ nodejs-18_x ];

          shellHook = with pkgs; ''
            export PATH="$PWD/node_modules/.bin/:$PATH"
            echo "node `${nodejs-18_x}/bin/node --version`"
          '';
        };
    });
}
