import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession, hashPassword, comparePassword } from '@/lib/auth';

export async function PUT(request: Request) {
  const session = getAuthSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { email, currentPassword, newPassword } = await request.json();

    if (!email || !currentPassword) {
      return NextResponse.json(
        { error: 'Email y contraseña actual son requeridos.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'La contraseña actual ingresada es incorrecta.' },
        { status: 400 }
      );
    }

    const updateData: any = {
      email: email.toLowerCase().trim(),
    };

    if (newPassword && newPassword.trim().length >= 6) {
      updateData.passwordHash = await hashPassword(newPassword.trim());
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: '¡Credenciales de acceso actualizadas exitosamente!',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
    });
  } catch (error) {
    console.error('Error updating admin credentials:', error);
    return NextResponse.json(
      { error: 'Error al cambiar credenciales de acceso' },
      { status: 500 }
    );
  }
}
