# Upload Share

A simplistic file-sharing service for self hosting.

![screenshot](./media/Screenshot.png)

## Developing

Once you've created a project and installed dependencies with `pnpm install` (or `pnpm install` or `yarn`), start a development server:

```bash
# Start the server
pnpm run dev

# Start the server and open the app in a new browser tab
pnpm run dev -- --open

# Start the server and make it visible for external hosts
pnpm run dev --host 0.0.0.0
```

## Configuration

The application is configured via environment variables provided in the file `.env`.

```bash
# Copy the default configuration file
cp .env.example .env
```

The file can be used for developing and production builds. However, build-time variables (see
`.env.example`) will be burnt into the docker image.

## Building Docker Images

### Docker

```bash
# Current platform
docker build . -t upload-share --pull
# Arm64
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
docker build . -t upload-share --platform=linux/arm64 --pull
```

### Podman

```bash
# Current platform
podman build . -t upload-share --pull
# Setup multiarch (Arch Linux)
sudo pacman -S qemu-user-static qemu-user-static-binfmt
sudo systemctl start systemd-binfmt.service
reboot
# Build for Arm64
podman build . -t upload-share --platform=linux/arm64 --pull
```

## Save and Load Docker Image from File

```bash
docker save -o upload-share.tar upload-share
docker load -i upload-share.tar
```

See `scripts/deploy.sh` for a complete example of building and deploying via Docker / Podman.

## Deploying With Docker Compose

The application can be deployed using the provided `docker-compose.yml`. Configuration has to be provided with an `.env` file in the same directory.

## License

This software is distributed under the [GNU General Public License Version 3](./LICENSE).

The icon is based on a [Material Design Icon](https://github.com/material-icons/material-icons/blob/master/svg/download/round.svg) licensed under the [Apache License 2.0](https://github.com/material-icons/material-icons/blob/master/LICENSE).
