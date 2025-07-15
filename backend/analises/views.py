from django.shortcuts import render

# PROJETOHABER/backend/analises/views.py

from rest_framework import viewsets
from .models import RegistroAnalise, DetalheAnalise
from .serializers import RegistroAnaliseSerializer, DetalheAnaliseSerializer
from rest_framework.response import Response
from rest_framework import status

class RegistroAnaliseViewSet(viewsets.ModelViewSet):
    queryset = RegistroAnalise.objects.all().order_by('-data_analise', 'produto_mat_prima__nome')
    serializer_class = RegistroAnaliseSerializer

    # Sobrescrever o método retrieve (GET por ID) para garantir que os detalhes venham
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # Sobrescrever o método create para lidar com a criação de detalhes
    def create(self, request, *args, **kwargs):
        data = request.data
        detalhes_data = data.pop('detalhes', []) # Pega os detalhes, se existirem

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer) # Salva o RegistroAnalise principal

        registro_analise_instance = serializer.instance

        for detalhe_data in detalhes_data:
            detalhe_data['registro_analise'] = registro_analise_instance.id # Associa ao registro criado
            detalhe_serializer = DetalheAnaliseSerializer(data=detalhe_data)
            detalhe_serializer.is_valid(raise_exception=True)
            detalhe_serializer.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class DetalheAnaliseViewSet(viewsets.ModelViewSet):
    queryset = DetalheAnalise.objects.all()
    serializer_class = DetalheAnaliseSerializer