{ pkgs ? import <nixpkgs> { } }:
with pkgs;
mkShell rec {
  buildInputs = [
    nodejs-16_x
    yarn
    efm-langserver
    nodePackages.eslint
    nodePackages.prettier
    nodePackages.eslint_d
    nodePackages.typescript-language-server
  ];
}
