import type { HookContext } from "hardhat/types/hooks";
import type {
  BuildOptions,
  CompilationJobCreationError,
  FileBuildResult,
} from "hardhat/types/solidity";

/**
 * Hardhat 3 hook handler that filters Foundry-style `.t.sol` test files out
 * of the default Solidity build. Foundry compiles them itself; feeding them
 * to the Hardhat solc pipeline would either fail or produce duplicate
 * artifacts.
 *
 * Pointed at from the `hookHandlers.solidity` field of the local Foundry
 * filter plugin defined in `hardhat.config.ts`.
 */
export default async () => {
  const build = async (
    _context: HookContext,
    rootFilePaths: string[],
    options: BuildOptions | undefined,
    next: (
      nextContext: HookContext,
      nextRootFilePaths: string[],
      nextOptions: BuildOptions | undefined,
    ) => Promise<CompilationJobCreationError | Map<string, FileBuildResult>>,
  ): Promise<CompilationJobCreationError | Map<string, FileBuildResult>> => {
    const filtered = rootFilePaths.filter(
      (filePath) => !filePath.endsWith(".t.sol"),
    );
    return next(_context, filtered, options);
  };

  return { build };
};
