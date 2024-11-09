import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export default async function createFile(
  directory: 'downloads' | 'documents',
  filename: string,
  fileContent: string
): Promise<string> {
  let basePath = RNFS.DocumentDirectoryPath

  if (Platform.OS === 'android' && directory === 'downloads') {
    basePath = RNFS.DownloadDirectoryPath
  }

  const path = basePath + '/' + filename + '.openchord';
  const exists = await RNFS.exists(path)

  if (exists) {
    await RNFS.unlink(path)
  }

  await RNFS.writeFile(path, fileContent, 'utf8')
  
  return path
}