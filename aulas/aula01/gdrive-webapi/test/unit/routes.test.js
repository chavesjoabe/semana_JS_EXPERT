import { describe, test, expect, jest } from "@jest/globals";
import Routes from "../../src/routes.js";

const defaultParams = {
  req: {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "",
    body: {},
  },
  res: {
    setHeader: jest.fn(),
    writeHead: jest.fn(),
    end: jest.fn(),
  },
  values: () => Object.values(defaultParams),
};

describe("Routes Test Suite", () => {
  describe("SET_SOCKET_INSTANCE", () => {
    test("setSocket should store io instance", () => {
      const routes = new Routes();
      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {},
      };
      routes.setSocketInstance(ioObj);
      expect(routes.io).toStrictEqual(ioObj);
    });
  });

  describe("HANDLER", () => {
    test("given an inexistent it should choose default route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };
      params.req.method = "inexistent";

      await routes.handler(...params.values());

      expect(params.res.end).toHaveBeenCalledWith("hello world");
    });

    test("it should allow any request with CORS enabled", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };
      params.req.method = "inexistent";

      await routes.handler(...params.values());

      expect(params.res.setHeader).toHaveBeenCalledWith(
        "Access-Control-Allow-Origin",
        "*"
      );
    });

    test("given method OPTION it should choose option route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };
      params.req.method = "OPTIONS";

      await routes.handler(...params.values());

      expect(params.res.writeHead).toHaveBeenCalledWith(204);
      expect(params.res.end).toHaveBeenCalled();
    });

    test("given method POST it should choose post route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };
      params.req.method = "POST";

      jest.spyOn(routes, routes.post.name).mockResolvedValue();

      await routes.handler(...params.values());

      expect(routes.post).toHaveBeenCalled();
    });

    test("given method GET it should choose get route", async () => {
      const routes = new Routes();
      const params = {
        ...defaultParams,
      };
      params.req.method = "GET";

      jest.spyOn(routes, routes.get.name).mockResolvedValue();

      await routes.handler(...params.values());

      expect(routes.get).toHaveBeenCalled();
    });
  });

  describe("GET", () => {
    test("given method GET it should list all files downloaded", async () => {
      const routes = new Routes();

      const params = {
        ...defaultParams,
      };

      const filesStatusesMock = [
        {
          size: "75 B",
          lastModified: "2021-09-10T21:04:59.768Z",
          owner: "Joabe Chaves",
          file: "file.txt",
        },
      ];

      jest
        .spyOn(routes.fileHelper, routes.fileHelper.getFileStatus.name)
        .mockResolvedValue(filesStatusesMock);

      params.req.method = "GET";
      await routes.handler(...params.values());

      expect(params.res.writeHead).toHaveBeenCalledWith(200);
      expect(params.res.end).toHaveBeenCalled();
    });
  });
});
