import { describe, test, expect, jest } from "@jest/globals";
import fs from "fs";
import FileHelper from "../../src/fileHelper.js";
import Routes from "../../src/routes.js";

describe("FileHelper", () => {
  describe("GET_FILE_STATUS", () => {
    test("it should return files status in correct format", async () => {
      const statMock = {
        dev: 2731943695,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 8162774325302216,
        size: 75,
        blocks: 0,
        atimeMs: 1631307954873.8894,
        mtimeMs: 1631108854827.9712,
        ctimeMs: 1631307900360.8936,
        birthtimeMs: 1631307899768.1262,
        atime: "2021-09-10T21:05:54.874Z",
        mtime: "2021-09-08T13:47:34.828Z",
        ctime: "2021-09-10T21:05:00.361Z",
        birthtime: "2021-09-10T21:04:59.768Z",
      };

      const mockUser = "Joabe Chaves";
      process.env.USER = mockUser;
      const fileName = "links.txt";

      jest
        .spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([fileName]);

      jest
        .spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);

      const result = await FileHelper.getFileStatus("/tmp");

      const expectedResult = [
        {
          size: "75 B",
          lastModified: "2021-09-10T21:04:59.768Z",
          owner: mockUser,
          file: fileName,
        },
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${fileName}`);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
