# Vox Guard

## Overview
Vox Guard is an application that leverages zero knowledge proofs to enable anonymous reporting and receive donations on USDC for victims of domestic and sexual violence. The application is built using Next.js for the frontend, Express for the backend, and Hardhat for smart contract development.

## Table of Contents
- [Vox Guard](#vox-guard)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Deployed contractgs](#deployed-contractgs)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Features
- Proof of humanity and uniqueness using World ID
- Anonymous reporting using zero knowledge proofs
- Anonymous claim of donations on USDC
- Secure and private data handling
- User-friendly interface for submitting reports
- Blockchain integration for immutable records

## Tech Stack
- **Frontend:** Next.js
- **Backend:** Express
- **Smart Contracts:** Hardhat
- **Blockchain:** Polygon Amoi

## Deployed contractgs
- **Semaphore** - 0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f
- **Reporting** - 0xaD70d6F2E00378B13579611a633964b7bE63957B
- **Donations** - XXXX

## Installation

### Prerequisites
- Node.js (v20 or higher)
- Yarn 4.1.0
- Hardhat
- Git

### Steps
1. Clone the repository:
    ```sh
    git clone https://github.com/dacarva/vox-guard.git
    cd vox-guard
    ```

2. Install dependencies:
    ```sh
    yarn set version stable
    yarn install
    ```

3. Set up environment variables:
    In each one of the packages (backend, client and contracts)    create a `.env` file in the root directory and add the necessary environment variables. Refer to `.env.example` for the required variables.

4. Compile the smart contracts:
    ```sh
    cd packages/contracts
    yarn hardhat compile
    ```

5. Deploy the smart contracts:
    ```sh
    yarn deploy --semaphore 0x1e0d7FF1610e480fC93BdEC510811ea2Ba6d7c2f --network matic-amoy
    ```

6. Start the development server:
    ```sh
    yarn dev
    ```

## Usage
1. Open your browser and navigate to `http://localhost:3000`.
2. Use the interface to submit anonymous reports.
3. The backend will handle the reports and store them securely using zero knowledge proofs.

## Contributing
We welcome contributions! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.