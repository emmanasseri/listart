import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  Input,
  useClipboard,
  Image,
  Link,
} from "@chakra-ui/react";
import Arrow from "./Arrow";

const Embedder = ({ isOpen, onClose, artworkUrl }) => {
  const { onCopy, hasCopied } = useClipboard(artworkUrl);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Embed This Work</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            {/* Step 1 */}
            <Text fontSize="lg" fontWeight="bold">
              Step One: Click the button below to copy this URL
            </Text>
            <Input
              value={artworkUrl}
              isReadOnly
              placeholder="Your artwork URL"
            />
            <Button onClick={onCopy} mt={2}>
              {hasCopied ? "Copied!" : "Copy URL"}
            </Button>
            <Arrow />

            {/* Step 2 */}
            <Text fontSize="lg" fontWeight="bold">
              Step Two: Download the NFC Tools app
            </Text>
            <Link
              href="https://play.google.com/store/apps/details?id=com.wakdev.wdnfc"
              isExternal
            >
              <Button colorScheme="teal">Get on Google Play</Button>
            </Link>
            <Link
              href="https://apps.apple.com/us/app/nfc-tools/id1252962749"
              isExternal
            >
              <Button colorScheme="teal">Get on App Store</Button>
            </Link>
            <Arrow />

            {/* Step 3 */}
            <Text fontSize="lg" fontWeight="bold">
              Step Three: Open the app
            </Text>
            <Image src="/tutorial_images/step3.jpeg" alt="Open NFC Tools App" />
            <Arrow />
            {/* Step 4 */}
            <Text fontSize="lg" fontWeight="bold">
              Step Three: Click the Write Button
            </Text>
            <Image
              src="/tutorial_images/step4.jpeg"
              alt="Click the Write Button"
            />
            <Arrow />
            <Arrow />
            {/* Step 5 */}
            <Text fontSize="lg" fontWeight="bold">
              Step Five: Click Add a Record
            </Text>
            <Image src="/tutorial_images/step5.jpeg" alt="Click Add a Record" />
            <Arrow />
            <Arrow />
            {/* Step 6 */}
            <Text fontSize="lg" fontWeight="bold">
              Step Six: Click URL / URI
            </Text>
            <Image src="/tutorial_images/step6.jpeg" alt="Click URL / URI" />
            <Arrow />
            <Text fontSize="lg" fontWeight="bold">
              Step Seven: Paste your URL into the text field and click OK
            </Text>
            <Image src="/tutorial_images/step7.jpeg" alt="Paste your URL" />
            <Arrow />
            <Text fontSize="lg" fontWeight="bold">
              Step Eight: Click Write / 150 Bytes
            </Text>
            <Image src="/tutorial_images/step8.jpeg" alt="Click OK" />
            <Arrow />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Embedder;
