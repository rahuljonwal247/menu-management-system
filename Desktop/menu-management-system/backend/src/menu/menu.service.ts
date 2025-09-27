import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getAllMenus() {
    return this.prisma.menu.findMany({
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true,
              },
            },
          },
        },
        parent: true,
      },
      orderBy: [{ depth: 'asc' }, { position: 'asc' }],
    });
  }

  async getMenuHierarchy() {
    const rootMenus = await this.prisma.menu.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: {
                  include: {
                    children: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { position: 'asc' },
    });

    return rootMenus;
  }

  async getMenuById(id: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        children: true,
        parent: true,
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with ID ${id} not found`);
    }

    return menu;
  }

  async createMenu(createMenuDto: CreateMenuDto) {
    const { parentId, ...menuData } = createMenuDto;

    let depth = 0;
    if (parentId) {
      const parent = await this.getMenuById(parentId);
      depth = parent.depth + 1;
    }

    // Get the next position for this level
    const lastMenu = await this.prisma.menu.findFirst({
      where: { parentId },
      orderBy: { position: 'desc' },
    });

    const position = createMenuDto.position ?? (lastMenu ? lastMenu.position + 1 : 0);

    return this.prisma.menu.create({
      data: {
        ...menuData,
        parentId,
        depth,
        position,
      },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async updateMenu(id: string, updateMenuDto: UpdateMenuDto) {
    const existingMenu = await this.getMenuById(id);

    let depth = existingMenu.depth;
    if (updateMenuDto.parentId !== undefined) {
      if (updateMenuDto.parentId) {
        const parent = await this.getMenuById(updateMenuDto.parentId);
        depth = parent.depth + 1;
      } else {
        depth = 0;
      }
    }

    return this.prisma.menu.update({
      where: { id },
      data: {
        ...updateMenuDto,
        depth,
      },
      include: {
        children: true,
        parent: true,
      },
    });
  }

  async deleteMenu(id: string) {
    const menu = await this.getMenuById(id);
    
    // Delete the menu and its children (cascade is enabled in schema)
    return this.prisma.menu.delete({
      where: { id },
    });
  }

  async getMenuWithDepth(id: string, maxDepth: number = 5) {
    const buildInclude = (depth: number): any => {
      if (depth <= 0) return true;
      return {
        include: {
          children: buildInclude(depth - 1),
        },
      };
    };

    return this.prisma.menu.findUnique({
      where: { id },
      include: {
        children: buildInclude(maxDepth),
        parent: true,
      },
    });
  }
}

