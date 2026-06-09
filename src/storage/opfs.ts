/**
 * Zero-Cloud OPFS Abstraction Layer
 * Provides access to the browser's Origin Private File System
 * as a drop-in replacement for Cloudinary/Firebase Storage/S3.
 */

export async function getStorageRoot(): Promise<FileSystemDirectoryHandle> {
  if (!navigator.storage || !navigator.storage.getDirectory) {
    throw new Error('OPFS is not supported in this environment.');
  }
  return await navigator.storage.getDirectory();
}

/**
 * Write a file to OPFS storage
 */
export async function writeOpfsFile(fileName: string, blob: Blob | string | BufferSource): Promise<void> {
  const root = await getStorageRoot();
  const fileHandle = await root.getFileHandle(fileName, { create: true });
  
  // Create a FileSystemWritableFileStream to write to
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}

/**
 * Read a file from OPFS storage
 */
export async function readOpfsFile(fileName: string): Promise<File> {
  const root = await getStorageRoot();
  const fileHandle = await root.getFileHandle(fileName);
  return await fileHandle.getFile();
}

/**
 * Read file as URL (for image tags, etc.)
 */
export async function getOpfsFileUrl(fileName: string): Promise<string> {
  const file = await readOpfsFile(fileName);
  return URL.createObjectURL(file);
}

/**
 * Delete a file from OPFS storage
 */
export async function deleteOpfsFile(fileName: string): Promise<void> {
  const root = await getStorageRoot();
  await root.removeEntry(fileName);
}

/**
 * Check if a file exists
 */
export async function opfsFileExists(fileName: string): Promise<boolean> {
  try {
    const root = await getStorageRoot();
    await root.getFileHandle(fileName);
    return true;
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return false;
    }
    throw error;
  }
}
